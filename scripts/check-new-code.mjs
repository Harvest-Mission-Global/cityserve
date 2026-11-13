#!/usr/bin/env node
// Holds new and changed lines in src/ to the AGENTS.md standard; old lines are left alone.
// Usage: node scripts/check-new-code.mjs   (or: yarn check:new-code). BASE_REF overrides the branch it compares to.
import { execFileSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";

const RULES = [
  {
    pattern: /["'`]#[0-9a-fA-F]{3,8}\b/,
    skip: (file) => file === "src/theme.js",
    message: 'raw hex colour. Use a theme token such as "brand.navy" (AGENTS.md #styling-standard).',
  },
  {
    pattern: /fontFamily=\{?["'`][^"'`]*(Antonio|Manrope)/,
    message: 'font name written by hand. Use a theme text style: textStyle="sectionTitle", "body", or "label".',
  },
  {
    pattern: /target=\{?["'`]_blank/,
    message: 'target="_blank". Use isExternal instead (it also adds rel="noopener").',
  },
  {
    pattern: /key=\{\s*(index|idx|i)\s*\}/,
    message: "array index used as key. Use a stable value from the data, such as an id or a name.",
  },
  {
    pattern: /style=\{\{/,
    message: "inline style={{...}}. Use Chakra style props instead.",
  },
  {
    pattern: /console\.log\(/,
    skip: (file) => /\.test\.js$/.test(file),
    message: "console.log left in the code. Remove it.",
  },
  {
    pattern: /PUBLIC_URL\s*\+\s*["'`]images\//,
    message: 'image path without a leading slash. Use process.env.PUBLIC_URL + "/images/...".',
  },
  {
    pattern: /display=\{\{[^}]*["'`]none["'`]/,
    message:
      "hides a block at some screen sizes; this usually means a second mobile/desktop copy. Use one responsive component instead (AGENTS.md #styling-standard). If you are editing an existing copy, ask the human.",
  },
];

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

const isProjectRepo = () => {
  try {
    return realpathSync(git("rev-parse", "--show-toplevel").trim()) === realpathSync(process.cwd());
  } catch {
    return false;
  }
};

const findBase = () => {
  if (!isProjectRepo()) return null;
  const candidates = [
    process.env.BASE_REF,
    "origin/development",
    "development",
    "origin/main",
  ].filter(Boolean);
  for (const ref of candidates) {
    try {
      return git("merge-base", "HEAD", ref).trim();
    } catch {}
  }
  return null;
};

const addedLines = (base) => {
  const lines = [];
  let file = null;
  let lineNumber = 0;
  for (const line of git("diff", "--unified=0", "--no-color", base, "--", "src").split("\n")) {
    if (line.startsWith("+++ ")) {
      file = line.startsWith("+++ b/") ? line.slice(6) : null;
    } else if (line.startsWith("@@")) {
      lineNumber = Number(/\+(\d+)/.exec(line)[1]);
    } else if (line.startsWith("+") && file) {
      lines.push({ file, lineNumber, text: line.slice(1) });
      lineNumber += 1;
    }
  }
  for (const newFile of git("ls-files", "--others", "--exclude-standard", "src").split("\n")) {
    if (!newFile) continue;
    readFileSync(newFile, "utf8")
      .split("\n")
      .forEach((text, index) => lines.push({ file: newFile, lineNumber: index + 1, text }));
  }
  return lines.filter(({ file }) => /\.(js|jsx)$/.test(file));
};

const base = findBase();
if (!base) {
  console.log("check-new-code: skipped (this folder is not its own repository, or it has no development or main branch)");
  process.exit(0);
}

const problems = [];
const isCommentLine = (text) => /^\s*(\/\/|\/\*|\{\/\*|\*)/.test(text);

for (const { file, lineNumber, text } of addedLines(base)) {
  if (isCommentLine(text)) continue;
  for (const rule of RULES) {
    if (rule.pattern.test(text) && !rule.skip?.(file)) {
      problems.push(`${file}:${lineNumber}  ${rule.message}\n      ${text.trim()}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`check-new-code: ${problems.length} problem(s) in lines you added or changed\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error("\nOld lines you did not touch are fine. Fix only the lines listed above.");
  console.error("check-new-code: FAILED");
  process.exit(1);
}
console.log("check-new-code: OK (new and changed lines follow the standard)");
