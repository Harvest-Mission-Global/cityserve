---
name: gh-execute
description: Work through a GitHub issue or a markdown plan for cityserve task by task - create the branch, do each task, verify it, tick it off, and commit. Use when given an issue number, an issue link, or a plan file, or invoked as /gh-execute <issue-or-path>.
---

# gh-execute

## Input

You need **one** of these. If you have neither, ask for it.

- A GitHub issue: `42`, `#42`, or a link. Read it with `gh issue view 42 --comments`.
- A plan file: a path to a `.md` file with a checklist (`- [ ] ...`).

If the issue has no checklist, write a short checklist in your reply first (3–7 steps), and ask the human to confirm it before you start.

## Before the first task

1. Read `AGENTS.md` and follow its "Do this BEFORE" steps for the kind of work in the issue.
2. Make sure there are no uncommitted changes: `git status`. If there are, stop and ask.
3. Create the branch from `development` (see `.agents/docs/git-workflow.md`):

   ```bash
   git switch development
   git pull --rebase
   git switch -c <issue#>-<short-description>
   ```

## For each task, in order

1. Read the matching skill from the Task Router in `AGENTS.md`, and do the task.
2. Run `yarn verify`. It must print `VERIFY PASSED`.
3. Tick the task:
   - Plan file: change `- [ ]` to `- [x]` and add one line under it saying what you did.
   - GitHub issue: post a short comment: `gh issue comment 42 --body "Done: <task> — <one line>"`. Do not edit the issue body.
4. Commit only the files of this task: `git add <files>` then `git commit -m "GH-<issue#>: <task>"`.

Stop and ask the human when a task needs a link, date, number, translation, or design decision that the issue does not give you. Do not guess.

## After the last task

1. Do the browser check from `.agents/skills/verify/SKILL.md` (desktop and mobile, English and 繁).
2. Do **not** push or open a PR unless the human asks. When asked, follow the Pull requests part of `.agents/docs/git-workflow.md`.
3. Report: the tasks done, the commits, the `VERIFY REPORT` block, and anything under **Needs a human**.
