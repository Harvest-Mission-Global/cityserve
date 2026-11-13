---
name: verify
description: Check that a change in cityserve is really done - run yarn verify and yarn screenshots (text-only page checks on desktop and mobile in English and Traditional Chinese). Use at the end of every task, before you commit, and whenever you want to say "done".
---

# verify

You are done only when **all** of these are true. Do them in order.

## 1. Run the automatic checks

If `yarn verify` says the command or script does not exist, you are on a branch without the harness. **Stop.** Do not replace it with `yarn build` alone. Tell the human which branch you are on and ask which branch to start from.

```bash
yarn verify
```

It runs five steps and stops at the first one that fails:

| Step | What it catches | How to fix |
| --- | --- | --- |
| 1. Lint | Unused variables, missing imports, wrong hooks use | Read the file and line in the message. Fix that line. |
| 2. Content check | A key missing in `en` or `zh`, Simplified Chinese, an image file that does not exist | The message says which key or file. Add the key to the other language, use Traditional characters, or fix the image path. |
| 3. New-code check | A line you added or changed that breaks `#code-standard` or `#styling-standard`: raw hex colour, font name by hand, `target="_blank"`, index as `key`, `style={{}}`, `console.log`, a mobile/desktop copy | The message gives the line and the fix. Old lines are never reported. |
| 4. Smoke test | The page crashes, shows `undefined`, has a `.map()` item without `key`, or has a wrong prop | The message names the warning and the component file. |
| 5. Build | Anything that breaks the Netlify build. Warnings count as errors here. | Fix the first error or warning in the output. |

The last line must be `VERIFY PASSED`. If it says `VERIFY FAILED`:

1. Read the **first** error only.
2. Fix it.
3. Run `yarn verify` again.

Never change `scripts/`, `src/App.test.js`, `package.json`, or the ESLint config to make a check pass. Fix your code instead. If you think a check is wrong, stop and tell the human.

After three failed tries, stop and report the full error to the human.

## 2. Run the page checks

```bash
yarn screenshots
```

It builds the site and opens it in a hidden Chrome at desktop (1440px), mobile (390px), and narrow phone (320px) width, in English and 繁. It checks the page **in code** and prints only text:

| Problem it finds | Example line |
| --- | --- |
| Console error or crash | `console error: ...  [mobile zh]` |
| Missing file | `404 for /images/logo.png  [desktop en, ...]` |
| Page scrolls sideways | `page scrolls sideways; too wide: <div> 600px wide ("...")` |
| Text cut off or spilling out of its box | `text does not fit its box: <p> "..."` |
| Image that did not load | `image did not load: <img> "..."` |
| Buttons or links on top of each other | `buttons or links overlap: <a> "..." and <button> "..."` |
| Text hard to read on its background | `text colour too close to its background (contrast 2.1:1, needs 4.5:1): <p> "..."` |
| Image without `alt` | `image has no alt text: <img> "/images/logo.png"` |
| Button or link without a name (for example an icon only) | `button or link has no name for screen readers: <button ...>` |
| Button or link too small to tap on a phone | `button or link too small to tap (58x11px, needs 24x24): <a> "..."` |

The site already had some of these problems before the harness existed. They are listed in `scripts/page-check-baseline.json`, and the script tells you to ignore them. **You fail only for new problems.** Never edit the baseline file or run `--update-baseline`; only a human does that, after fixing old problems on purpose.

The last line must be `screenshots: PASSED`. If not, fix the first new problem and run it again. The text in quotes tells you which element to search for: `rg -n "<that text>" src`.

**The text result is the required check.** The script also saves PNG files you **may** open to check your work yourself. This is optional: a human checks the final screenshots on the PR anyway (CI attaches them).

| File | What it shows |
| --- | --- |
| `screenshots/parts/<desktop\|mobile>-<en\|zh>-NN.png` | One screen, top of the page first (`01`). **Open these.** |
| `screenshots/<desktop\|mobile>-<en\|zh>.png` | The whole page. Too small to read; do not open. |

**Watch your context before you open images.** Each image costs about 500 (mobile) to 2,000 (desktop) tokens, about the same as a long file. Skip the images, and say so in your report, when:

- your model cannot read images,
- your context window is small (32k tokens or less), or this conversation is already long (more than about half of your context is used), or
- the change is only text, links, or numbers. The text checks already cover these.

When you do open images: start with the mobile parts (they are cheaper and break first), open only the parts that show what you changed, and stop at about four images.

## 3. Optional: look at the page in a real browser

Step 2 already checks the page. Skip this step unless a human sits with you and can look, or the human asked for it. Browser tools that send page snapshots to you use a lot of context.

Start the dev server in the background (it never exits by itself):

```bash
yarn start
```

Open `http://localhost:3000` and check every section you changed:

| Width | Language |
| --- | --- |
| Desktop, 1440px wide | English |
| Desktop, 1440px wide | 繁 (click `繁` in the header) |
| Mobile, 390px wide | English |
| Mobile, 390px wide | 繁 |

For each one, check:

- Nothing overlaps, nothing is cut off, and there is no sideways scrolling.
- The text is the new text, in the right language.
- Images load (no broken-image icon).
- Links and buttons go to the right place.
- The browser console has no red errors.

Clicking links and buttons is a human check unless you did it here; list it under **Needs a human**. Never say "looks good" about something you did not check.

## 4. Report

End your reply with this block, filled in truthfully:

```
VERIFY REPORT
- yarn verify: PASSED / FAILED (<first error>)
- yarn screenshots: PASSED / FAILED (<first problem>)
- Images I opened: <file names, or "none">
- Browser check: done / skipped
- Files changed: <list>
- Needs a human: <anything unsure, or "nothing">
```
