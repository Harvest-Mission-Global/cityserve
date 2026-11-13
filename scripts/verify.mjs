#!/usr/bin/env node
// One command that decides "done": yarn verify
import { spawnSync } from "node:child_process";

const STEPS = [
  { name: "Lint (ESLint, zero warnings)", command: "yarn", args: ["-s", "lint"] },
  { name: "Content check (translations, images)", command: "node", args: ["scripts/check-content.mjs"] },
  { name: "New-code check (your lines follow the standard)", command: "node", args: ["scripts/check-new-code.mjs"] },
  { name: "Smoke test (page renders in EN and 繁)", command: "yarn", args: ["-s", "test"] },
  { name: "Production build (same as Netlify)", command: "yarn", args: ["-s", "build"] },
];

// Netlify builds with CI=true, which turns every build warning into an error.
const env = { ...process.env, CI: "true", BROWSERSLIST_IGNORE_OLD_DATA: "true" };

for (const [index, step] of STEPS.entries()) {
  const label = `[${index + 1}/${STEPS.length}] ${step.name}`;
  console.log(`\n=== ${label}`);
  const result = spawnSync(step.command, step.args, {
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    console.error(`\nVERIFY FAILED at ${label}.`);
    console.error("Read the first error above, fix it, then run `yarn verify` again.");
    process.exit(1);
  }
}

console.log("\nVERIFY PASSED");
