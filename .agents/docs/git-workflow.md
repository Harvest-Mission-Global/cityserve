# Git workflow: branches, commits, pull requests

Every change is linked to a GitHub issue number. No issue yet? Ask the human for one, or create it with `gh issue create`.

## Branches

- `development` is the working branch. Start from it and open PRs into it, unless the human names another branch: then start from that one.
- Before you start, check that `scripts/verify.mjs` exists on your branch. If it does not, stop and ask (see the `verify` skill).
- `main` is the old release branch. Do not touch it unless the human asks.
- **Never commit on, push to, or force-push `main` or `development`.** A push there can update the live website.
- New branch name: `<issue#>-<short-description>`, lowercase, words joined with `-`.

```bash
git switch development
git pull --rebase
git switch -c 42-update-2027-dates
```

Good: `42-update-2027-dates`, `57-fix-mobile-header`. Bad: `fix`, `my-branch`, `GH-42`.

## Commits

```
GH-<issue#>: <what this commit does>
```

- Start with `GH-`, the issue number, a colon, and a space.
- Then a short description in plain English. No full stop at the end.
- No `feat:` or `fix(ui):` prefixes.
- One commit for each finished step is fine. Review fixes use the same number: `GH-42: address review comments`.
- Run `yarn verify` before you commit. The pre-commit hook also runs lint and the content check.

Good:

```
GH-42: update event dates to March 2027
GH-57: stop header buttons from overlapping on mobile
```

Bad: `update`, `fix stuff`, `GH-42 changes`, `feat: dates`.

Never use `git add .` or `git add -A`. Add only the files you changed on purpose:

```bash
git status
git add src/components/Translation.js src/components/Footer.js
git commit -m "GH-42: update event dates to March 2027"
```

## Pull requests

Open the PR into `development`:

```bash
git push -u origin 42-update-2027-dates
gh pr create --base development --title "GH-42: Update event details for 2027" --body-file pr-body.md
```

Delete `pr-body.md` after the PR is open. Do not commit it.

- **Title:** same shape as a commit: `GH-<issue#>: <what the whole branch does>`.
- **First line of the body:** `Closes #<issue#>`, or `Part of #<issue#>` when the issue needs more PRs. The `pr-format` check fails without it.
- **Body:** use the template below. Delete a section that does not apply; do not write "N/A".
- **No file paths or line numbers in the text.** GitHub already shows them.
- **Screenshots:** desktop and mobile, English and 繁體中文, for every visible change. `yarn screenshots` saves them in `screenshots/parts/`; the `verify` GitHub Action also uploads them to the PR's run.
- **No personal data** in the body or screenshots.

```markdown
Closes #<issue#>

<1–3 sentences: what was wrong or missing, what changed, what the visitor sees now.>

## Changes

| Area | Before | After |
| --- | --- | --- |
| Event date | APRIL 4-6, 2025 | MARCH 19-21, 2027 |

## Screenshots

|  | Desktop (1440px) | Mobile (390px) |
| --- | --- | --- |
| English |  |  |
| 繁體中文 |  |  |

## Verification

- [ ] `yarn verify` prints `VERIFY PASSED`
- [ ] `yarn screenshots` prints `screenshots: PASSED`
- [ ] Checked desktop (1440px) and mobile (390px)
- [ ] Checked English and 繁體中文

## Needs a human

- <anything you were not sure about, for example a Chinese translation to check>
```
