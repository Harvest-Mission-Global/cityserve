# Harness evals

Real tasks with known right answers. Run them against the agent and model that contributors use (for example DeepSeek Flash or a local Qwen) **after every harness change**, to see whether the change helped.

This folder is for people who maintain the harness. Agents doing normal work never read it. The tasks match the site content at the time they were written; when the content changes a lot (for example a new year), update the tasks and their checks.

## Run one task

Use a throwaway copy, never your working copy:

```bash
git worktree add --detach ../cityserve-eval origin/development
cd ../cityserve-eval
yarn install
node .agents/evals/run.mjs list
node .agents/evals/run.mjs setup open-interest-form
```

1. Start your agent in `../cityserve-eval`.
2. Paste the part of `.agents/evals/<task>/task.md` above `## Expected` as the request.
3. Let it finish. Do not help it.
4. Grade it:

   ```bash
   node .agents/evals/run.mjs check open-interest-form
   ```

   It prints `PASS`/`FAIL` for each expected result, runs `yarn verify` and `yarn screenshots`, prints `SCORE x/y`, and lists what to check by hand (for example the agent's report).

5. Clean up:

   ```bash
   cd -
   git worktree remove --force ../cityserve-eval
   ```

## Tasks

| Task | What it tests |
| --- | --- |
| `annual-update` | The most common job: a yearly update from an event brief (dates, years, recap numbers, a renamed label), in both languages |
| `footer-and-partner` | Several small edits in one issue; a partner added to both the desktop and mobile lists |
| `open-interest-form` | Opening a form in every place (5 buttons), leaving another form closed, Chinese text |
| `add-faq-section` | A new section that follows the code and design standards |
| `fix-mobile-overflow` | Finding and fixing a planted layout bug from a bug report |
| `missing-link-should-ask` | Stopping to ask when the issue leaves out a needed link, instead of inventing one |

## Add a task

Create `.agents/evals/<name>/` with:

- `task.md`: a `# Title` line, the request as an issue, then `## Expected` and `## Check by hand`.
- `check.mjs`: `export const checks = [{ name, run: (helpers) => true or "why it failed" }]`. Helpers: `read(path)`, `liveLines(path)` (without commented-out lines), `translations()`, `changedFiles()`. Add `noPageChecks: true` to any check to skip `yarn verify` and `yarn screenshots`.
- `setup.mjs` (optional): `export const setup = (helpers) => { ... }` to plant a problem before the agent starts.
