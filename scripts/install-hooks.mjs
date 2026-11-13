#!/usr/bin/env node
// Runs on `yarn install` (the "prepare" script) and points git at .githooks/.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

if (!process.env.CI && existsSync(".git")) {
  const result = spawnSync("git", ["config", "core.hooksPath", ".githooks"], {
    stdio: "ignore",
  });
  if (result.status !== 0) {
    console.warn("install-hooks: could not set core.hooksPath; git hooks are off.");
  }
}
