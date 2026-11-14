#!/usr/bin/env node
// Harness evals: give a task to an agent in a throwaway copy of the repo, then grade the result.
// Usage: node .agents/evals/run.mjs list | setup <task> | check <task>
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

const EVALS_DIR = join(process.cwd(), ".agents", "evals");
const [command, taskName] = process.argv.slice(2);

const tasks = readdirSync(EVALS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (command === "list" || !command) {
  console.log("Tasks:");
  for (const name of tasks) {
    const firstLine = readFileSync(join(EVALS_DIR, name, "task.md"), "utf8").split("\n")[0];
    console.log(`  ${name.padEnd(24)} ${firstLine.replace(/^#\s*/, "")}`);
  }
  process.exit(0);
}

if (!tasks.includes(taskName)) {
  console.error(`Unknown task "${taskName}". Run: node .agents/evals/run.mjs list`);
  process.exit(1);
}
const taskDir = join(EVALS_DIR, taskName);

const helpers = {
  read: (path) => (existsSync(path) ? readFileSync(path, "utf8") : ""),
  liveLines: (path) =>
    helpers
      .read(path)
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .split("\n")
      .filter((line) => !/^\s*\/\//.test(line)),
  translations: () => {
    const source = helpers
      .read("src/components/Translation.js")
      .replace(/export\s+default\s+translations\s*;?/, "");
    return vm.runInNewContext(`${source}\ntranslations;`);
  },
  changedFiles: () => {
    const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    let topLevel = "";
    try {
      topLevel = realpathSync(git("rev-parse", "--show-toplevel").trim());
    } catch {}
    if (topLevel !== realpathSync(process.cwd())) throw new Error("run the eval inside a git worktree of this repo");
    return git("status", "--porcelain", "--untracked-files=all")
      .split("\n")
      .filter(Boolean)
      .map((line) => line.slice(3));
  },
};

if (command === "setup") {
  const setupFile = join(taskDir, "setup.mjs");
  if (existsSync(setupFile)) {
    const { setup } = await import(setupFile);
    setup(helpers);
    console.log(`setup: done. The task starts from a planted problem.`);
  } else {
    console.log("setup: nothing to prepare for this task.");
  }
  console.log(`Give the agent the text of ${join(taskDir, "task.md")} (without the "Expected" section).`);
  process.exit(0);
}

if (command === "check") {
  const { checks } = await import(join(taskDir, "check.mjs"));
  const results = [];
  for (const check of checks) {
    let outcome;
    try {
      outcome = check.run(helpers);
    } catch (error) {
      outcome = `error: ${error.message}`;
    }
    results.push({ name: check.name, passed: outcome === true, detail: outcome === true ? "" : outcome });
  }

  const usesPage = !checks.some((check) => check.noPageChecks);
  if (usesPage) {
    for (const [name, script] of [
      ["yarn verify passes", "scripts/verify.mjs"],
      ["yarn screenshots passes", "scripts/screenshots.mjs"],
    ]) {
      const result = spawnSync("node", [script], { encoding: "utf8" });
      const output = `${result.stdout}${result.stderr}`.trim().split("\n");
      results.push({
        name,
        passed: result.status === 0,
        detail: result.status === 0 ? "" : output.filter((line) => /FAIL|problem|error/i.test(line)).slice(0, 3).join(" | "),
      });
    }
  }

  const passed = results.filter((result) => result.passed).length;
  for (const result of results) {
    console.log(`${result.passed ? "PASS" : "FAIL"}  ${result.name}${result.detail ? `  (${result.detail})` : ""}`);
  }
  console.log(`\nSCORE ${passed}/${results.length} for ${taskName}`);
  const manual = join(taskDir, "task.md");
  const manualPart = readFileSync(manual, "utf8").split("## Check by hand")[1];
  if (manualPart) console.log(`\nCheck by hand:${manualPart.trimEnd()}`);
  process.exit(passed === results.length ? 0 : 1);
}

console.error(`Unknown command "${command}". Use list, setup, or check.`);
process.exit(1);
