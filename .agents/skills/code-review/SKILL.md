---
name: code-review
description: Review a cityserve branch or pull request against development and decide if it is ready to merge. Read-only - never edits files. Use when asked to "review", "code review", or "check this PR".
---

# code-review

**Do not change any file.** You only read and report.

## 1. Get the changes

```bash
git fetch origin
git diff --stat origin/development...HEAD
git diff origin/development...HEAD
```

For a PR number, use `gh pr view <number>` and `gh pr diff <number>`. If the PR base is not `development`, use its base: `gh pr view <number> --json baseRefName`.

- Review the **final state** of the files, not each commit. Open the changed files and read them.
- Review only what this branch changed. Do not report old problems that the branch did not touch.

## 2. Run the checks

```bash
yarn verify
```

Write the result. A branch that does not print `VERIFY PASSED` is not ready.

## 3. Checklist

Go through every row. For each problem, write the file, what is wrong, and the fix.

| # | Check |
| --- | --- |
| 1 | Every new visible text is in `Translation.js`, in both `en` and `zh`. No visible words typed directly in JSX. |
| 2 | Chinese is Traditional (繁體), reads naturally, and matches the English meaning. |
| 3 | If a component has a desktop copy and a mobile copy, both are changed the same way. |
| 4 | All buttons of one form agree: all open with the same link, or all closed (`isDisabled`, link commented out). |
| 5 | Links, dates, and numbers match the issue. Nothing looks invented. |
| 6 | New and changed lines follow `#code-standard` and `#styling-standard` in `AGENTS.md`: theme colours (`brand.*`), theme fonts, one responsive component instead of mobile/desktop copies, repeated items from data + `.map()`, `isExternal` on external links. |
| 7 | New code does not copy a bad pattern from the old code next to it (raw hex, a new mobile/desktop copy, a render function defined inside a component). Do **not** report old mess that the branch did not touch. |
| 8 | New images are in `public/images/`, named in lowercase with `-`, under 300 KB, with `alt` text. |
| 9 | Every `.map()` item has a stable, unique `key` (not the array index). No wrong props. No `console.log`. No unused imports. |
| 10 | The diff changes only what the issue asked for. No unrelated reformatting, renaming, or cleanup. |
| 11 | No new dependency, no change to `package.json`, `yarn.lock`, `netlify.toml`, or `scripts/`, unless the issue asked for it. |
| 12 | No personal data (names, phones, emails of private people) in code, images, or the PR. |
| 13 | Commits and PR title follow `.agents/docs/git-workflow.md` (`GH-<issue#>: ...`), and the PR goes into `development`. |

## 4. Report

```
REVIEW
- yarn verify: PASSED / FAILED (<first error>)
- Problems:
  1. <file> — <what is wrong> — <fix, with a short code example>
  (or "none")
- Score: <1-10>
- Ready to merge: YES / NO (<one reason>)
```

For each problem with a code fix, show the current code and the fixed code next to each other.
