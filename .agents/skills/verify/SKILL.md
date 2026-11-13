---
name: verify
description: Check that a change in cityserve is really done - run yarn verify, then look at the page on desktop and mobile in English and Traditional Chinese. Use at the end of every task, before you commit, and whenever you want to say "done".
---

# verify

You are done only when **all** of these are true. Do them in order.

## 1. Run the automatic checks

```bash
yarn verify
```

It runs four steps and stops at the first one that fails:

| Step | What it catches | How to fix |
| --- | --- | --- |
| 1. Lint | Unused variables, missing imports, wrong hooks use | Read the file and line in the message. Fix that line. |
| 2. Content check | A key missing in `en` or `zh`, Simplified Chinese, an image file that does not exist | The message says which key or file. Add the key to the other language, use Traditional characters, or fix the image path. |
| 3. Smoke test | The page crashes, shows `undefined`, has a `.map()` item without `key`, or has a wrong prop | The message names the warning and the component file. |
| 4. Build | Anything that breaks the Netlify build. Warnings count as errors here. | Fix the first error or warning in the output. |

The last line must be `VERIFY PASSED`. If it says `VERIFY FAILED`:

1. Read the **first** error only.
2. Fix it.
3. Run `yarn verify` again.

Never change `scripts/`, `src/App.test.js`, `package.json`, or the ESLint config to make a check pass. Fix your code instead. If you think a check is wrong, stop and tell the human.

After three failed tries, stop and report the full error to the human.

## 2. Look at the page

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

If you cannot open a browser, say so clearly in your report and list these checks for the human to do. Do not say "looks good" if you did not look.

## 3. Report

End your reply with this block, filled in truthfully:

```
VERIFY REPORT
- yarn verify: PASSED / FAILED (<first error>)
- Browser check: done / NOT done (reason)
- Checked: desktop EN, desktop 繁, mobile EN, mobile 繁
- Files changed: <list>
- Needs a human: <anything unsure, or "nothing">
```
