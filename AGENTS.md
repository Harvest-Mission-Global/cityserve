# Instructions for AI coding agents in cityserve

This file is for every coding agent: OpenCode, Codex, Claude Code, Cursor, and local models.
`CLAUDE.md` only imports this file. Edit `AGENTS.md`, never `CLAUDE.md`.

## Do this BEFORE you plan, propose, or act

1. Find your task in the **Task Router** below. A task can match more than one row.
2. Open and read every file that the matching rows name.
3. For each file, write one **Compliance** line in your reply:
   > **Compliance (`<file>`):** "<one rule copied word for word from that file>" → <what you will do>
4. Only then start the work.

If no row matches, read `#golden-rules`, `#working-in-a-messy-codebase`, and `#code-standard`, then ask the human what they want.

## Task Router

| If the task is to... | Read this first |
| --- | --- |
| change, add, or fix any text the visitor sees (English or Chinese) | `.agents/skills/edit-text/SKILL.md` |
| update the event for a new year: dates, year, recap numbers, video, open or close the forms, form links | `.agents/skills/event-update/SKILL.md` |
| add or replace an image, icon, or partner logo | `.agents/skills/add-image/SKILL.md` |
| add a new section to the page | `.agents/skills/add-section/SKILL.md` |
| write or change any code in `src/` | `#working-in-a-messy-codebase` and `#code-standard` below |
| fix a layout, spacing, colour, or font problem | `#styling-standard` below, then `.agents/skills/verify/SKILL.md` |
| check that your work is done (always, at the end of every task) | `.agents/skills/verify/SKILL.md` |
| create a branch, write a commit message, open a PR | `.agents/docs/git-workflow.md` |
| review a branch or a PR | `.agents/skills/code-review/SKILL.md` |
| work through a GitHub issue or a plan with a checklist | `.agents/skills/gh-execute/SKILL.md` |

## Golden Rules

1. **Do only what was asked.** Do not reformat, rename, or "clean up" code you were not asked to touch.
2. **New code follows `#code-standard` and `#styling-standard`, not the old code next to it.** The old code is messy; do not copy it.
3. **Every visible text is in `src/components/Translation.js`, in both `en` and `zh`.** Never type visible words directly in JSX.
4. **Chinese is Traditional Chinese for Hong Kong (繁體).** Never Simplified (简体). `yarn check:content` fails on Simplified characters.
5. **Use `yarn`, never `npm` or `npx`.** `yarn.lock` is the real lock file. Do not touch `package-lock.json`.
6. **Do not add a dependency** (`yarn add`) unless the human says yes first.
7. **Never push to `main` or `development`, and never commit on them.** Pushing may update the live website. Work on a branch and open a PR.
8. **`yarn verify` must print `VERIFY PASSED`** before you say the work is done. If it fails, fix the first error and run it again.
9. **Check both screen sizes and both languages** (see `.agents/skills/verify/SKILL.md`).
10. **Do not guess links, dates, or numbers.** Form links, giving links, YouTube links, event dates, and recap numbers come from the human or the issue. If you do not have them, stop and ask.
11. **When you are not sure, stop and ask.** A short question is better than a wrong change.

## Project Overview

CityServe Hong Kong is a yearly city-wide weekend where churches and charities serve the city together.
This repo is its **one-page, bilingual (English / 繁體中文) marketing website**.

- **There is no server, no database, no login, no API, and no environment variable.** Everything is in the browser.
- **Netlify** builds and hosts the site from GitHub (`netlify.toml`: `yarn run build`, publishes `build/`).
- Tracking is GitHub Issues. PRs go into `development`.

## Technology

| Thing | What this repo uses |
| --- | --- |
| Framework | React 18, Create React App (`react-scripts` 5) |
| Language | **JavaScript** (`.js` files that contain JSX). No TypeScript. |
| UI library | **Chakra UI v2** (`@chakra-ui/react`), with Emotion and framer-motion |
| Fonts | `Antonio` for headings, `Manrope` for body text (from `@fontsource`) |
| Icons | `react-icons` (for example `import { FaInstagram } from "react-icons/fa6";`) |
| Routing | None. It is one page. The header scrolls to sections with React refs. |
| Tests | Jest + Testing Library: one smoke test in `src/App.test.js` |

Check `package.json` for exact versions before you use an API.

## Looking Up Docs

This repo uses **Chakra UI v2**. Most examples on the internet, and in your memory, are Chakra v3, which has different APIs. Never use v3 names such as `colorPalette`, `asChild`, `Card.Root`, `Field.Root`, `createSystem`, `defineConfig`, or `<Provider>`.

Before you use a Chakra component or prop that this repo does not already use, look it up:

- **With the Context7 tool** (set up for OpenCode, Codex, and Claude Code in this repo): call `query-docs` with `libraryId` = `/chakra-ui/chakra-ui/__branch__v2` and a short question, for example "SimpleGrid responsive columns". You do not need `resolve-library-id`.
- **Without Context7:** read <https://v2.chakra-ui.com/docs>.

## Commands

```bash
yarn install          # first time only
yarn start            # dev server on http://localhost:3000 — it never exits; run it in the background
yarn verify           # THE check: lint + content + new-code + smoke test + production build
yarn screenshots      # builds, then saves desktop/mobile × EN/繁 screenshots to screenshots/
yarn lint             # ESLint only, zero warnings allowed
yarn check:content    # translation keys, Traditional Chinese, image paths
yarn check:new-code   # your new and changed lines follow #code-standard and #styling-standard
yarn test             # smoke test only (runs once, then exits)
yarn build            # production build only, into build/
```

`yarn install` also turns on a git pre-commit hook (`.githooks/pre-commit`). It blocks commits on `main` and `development`, and it runs lint, the content check, and the new-code check.

`yarn check:new-code` only looks at lines that differ from `development`. Old lines are never reported. If it reports a line you changed, bring that line up to the standard; do not undo the change you were asked to make.

`yarn screenshots` needs Google Chrome. Without Chrome, run `yarn playwright install chromium` once. It also fails on console errors, missing files, and sideways scrolling.

## Files

| Path | What it is |
| --- | --- |
| `src/index.js`, `src/App.js` | Start-up. `App.js` adds the Chakra theme, fonts, and the `LanguageProvider`. |
| `src/theme.js` | Chakra theme: the `brand.*` colours and the two fonts. Old code does not use it yet; new code must. |
| `src/components/MainContainer.js` | Page frame: `Header`, `HomeContainer`, `Footer`. Creates the refs for header scrolling. |
| `src/components/HomeContainer.js` | **The order of the sections on the page.** |
| `src/components/*Section.js`, `ReCap.js` | One file per page section. |
| `src/components/Header.js` | Top bar. Has a desktop part and a mobile part (the `lg` breakpoint switches them). |
| `src/components/Footer.js` | Bottom bar, copyright year, Instagram link. |
| `src/components/LanguageToggle.js` | Language state. `useLanguage()` returns `{ language, toggleLanguage }`; `language` is `"en"` or `"zh"`. |
| `src/components/Translation.js` | **All visible text**, as `translations.en.*` and `translations.zh.*` with the same keys. |
| `public/images/` | All images. Code points to them with `process.env.PUBLIC_URL`. |
| `scripts/` | `verify.mjs`, `check-content.mjs`, `install-hooks.mjs`. |

## Working in a Messy Codebase

Volunteers with little experience wrote most of `src/components/`. You will see raw hex colours, raw `rem` sizes everywhere, the same block written twice (once for mobile, once for desktop), long copy-pasted lists, and mixed styles. **That is the starting point, not the standard.** Never copy a pattern just because the file next to it uses it.

| Code | What you do |
| --- | --- |
| Lines you do not need to change | Leave them exactly as they are. No reformatting, renaming, or tidying. |
| Lines you change | Bring them up to the standard below, but only if the fix stays inside those lines. |
| New code (new components, new blocks) | Follow the standard below completely. |
| Something old that is really bad | Do not fix it in this task. Write it under **Needs a human** in your report so it becomes its own issue and PR. |

- When an old file has two copies of a block (mobile and desktop) and you change one, change the other one the same way. Do not merge the copies unless the task asks for it.
- When two existing files do the same thing in different ways, say which one you followed and why.

## Code Standard

This applies to new code and to the lines you change.

- One component per file in `src/components/`, `PascalCase` file name, arrow function, `export default` at the end.
- A piece of UI that repeats is its own top-level component. Do not define helper render functions inside another component (old code does this with `PartnerDisplayBox`; do not copy it).
- Repeated items (cards, logos, links) come from an array of data and one `.map()`:

  ```javascript
  const STATS = [
    { key: "participants", number: "296" },
    { key: "churches", number: "8" },
  ];
  // ...
  {STATS.map((stat) => (
    <StatCard key={stat.key} number={stat.number} label={translations[language].recap[stat.key]} />
  ))}
  ```

- `key` must be a stable, unique value from the data (an id or a name). Never the array index. The smoke test fails if `key` is missing.
- Constants: `UPPER_SNAKE_CASE`, at the top of the file, outside the component.
- Read text from `Translation.js`, never as a hard-coded string:

  ```javascript
  const { language } = useLanguage();
  const t = translations[language];
  // ...
  <Text>{t.joinUs.title}</Text>
  ```

- Names: `camelCase` for variables and functions, `PascalCase` for components, `is/has/should` for booleans, `handle*` for event handlers, `on*` for event props.
- Only pass real Chakra props. A wrong prop (for example `fontColor`) goes to the HTML and the smoke test fails.
- Use a ternary for "show A or B". Use `&&` only for "show A or nothing".
- Style: 2 spaces, double quotes, semicolons, trailing commas.
- No `console.log`. No unused imports or variables (lint fails on them).
- Default to **no comments**. Write a comment only to explain *why*, never *what*.
- Code inside `{/* ... */}` or after `//` is switched off: it is **not** on the page. Do not copy facts (links, text) from it, and do not delete it unless asked. Some of it is kept on purpose (for example closed form links).

## Styling Standard

This applies to new code and to the lines you change.

- **Colours come from the theme** (`src/theme.js`), never as hex:

  | Token | Hex | Use for |
  | --- | --- | --- |
  | `brand.navy` | `#183B5D` | Main text, button hover |
  | `brand.blue` | `#1769B8` | Buttons |
  | `brand.logoBlue` | `#0053A4` | `CITYSERVE` logo text |
  | `brand.lightBlue` | `#DAEDFA` | Section backgrounds |
  | `brand.skyBlue` | `#99C6E6` | Highlighted words |
  | `brand.cream` | `#F9EEE3` | Recap background |
  | `brand.sand` | `#E0CEBB` | Highlighted words |
  | `brand.offWhite` | `#F8F8F8` | Header background, light text on buttons |
  | `white`, `teal.500` | `#FFFFFF`, `#319795` | Chakra built-ins |

  ```javascript
  <Box bgColor="brand.lightBlue" color="brand.navy">
  ```

  Need a colour that is not in the table? Stop and ask. Never invent one.
- **Fonts come from the theme:** `fontFamily="heading"` (Antonio) and `fontFamily="body"` (Manrope, the default, so you rarely need it). Use `<Heading as="h2">` for section titles.
- **Spacing uses the Chakra scale** where it fits: `p={4}`, `gap={6}`, `mt={8}` (4 = 1rem). Use a raw `rem` value only to match an exact design.
- **One responsive component, not two copies.** Change layout with responsive props, not with a mobile copy and a desktop copy:

  ```javascript
  <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={{ base: 4, lg: 6 }}>
  <Stack direction={{ base: "column", lg: "row" }}>
  ```

- Breakpoints: `base` (phones), `sm` 30em, `md` 48em, `lg` 62em, `xl` 80em. The header switches from mobile to desktop at `lg`.
- Use Chakra style props only. No `.css` files, no `style={{}}`, no `sx` when a normal prop does the same thing.

## Content Rules

- Images: `src={process.env.PUBLIC_URL + "/images/<file>"}`, with an `alt` text that says what the image shows (`alt=""` only for decoration).
- External links: `<Link href="..." isExternal>`, or `<Button as={Link} href="..." isExternal>`. `isExternal` opens a new tab safely (`target="_blank"` plus `rel="noopener"`). Old code uses `target="_blank"` alone; upgrade it only on lines you change.
- Use `<Button>` for actions and `<Link>` for going to another page or site.
- This is a public website. Never add names, phone numbers, emails, or photos of private people unless the issue gives them and says they are approved.

## Stop and Ask the Human When

- You need a link, a date, a number, a name, or a translation that you do not have.
- You are not sure that your Chinese is correct and natural for Hong Kong readers.
- The task needs a new dependency, a new page or route, a server, or a change to `netlify.toml`.
- The task would delete a section or a partner.
- `yarn verify` still fails after three tries.

## Tools: where each agent finds things

The real files live in `.agents/`. All other folders only point to them. **Edit only the files in `.agents/`.**

| Tool | Reads rules from | Skills | Sub-agents | Commands |
| --- | --- | --- | --- | --- |
| OpenCode | `AGENTS.md` | `.agents/skills/` (skill tool) | `.opencode/agents/` | `.opencode/commands/` → `/verify`, `/review`, ... |
| Codex | `AGENTS.md` | `.agents/skills/` (type `$` + skill name) | none: use the skill | none |
| Claude Code | `CLAUDE.md` → `AGENTS.md` | `.claude/skills/` (link to `.agents/skills/`) | `.claude/agents/` | every skill is a `/command` |
| Any other tool or local model | `AGENTS.md` | open `.agents/skills/<name>/SKILL.md` yourself | read `.agents/agents/<name>.md` yourself | none |

Agents:

- `cityserve-dev` (`.agents/agents/cityserve-dev.md`): makes changes.
- `cityserve-reviewer` (`.agents/agents/cityserve-reviewer.md`): reviews changes. It never edits files.

Skills (also OpenCode commands): `verify`, `edit-text`, `event-update`, `add-image`, `add-section`, `gh-execute`, `code-review` (OpenCode command: `/review`).

Guards that work in every tool: the pre-commit hook, `yarn verify`, and the `verify` GitHub Action on every PR (it also uploads the screenshots). `opencode.json` also makes OpenCode ask before `git push` and `yarn add`, and blocks `npm` and `npx`.

MCP servers: Context7 (docs lookup) is set up in `opencode.json`, `.codex/config.toml`, and `.mcp.json`. Codex loads `.codex/config.toml` only after you trust the project; Claude Code asks you to approve `.mcp.json` once.

To add a new skill: create `.agents/skills/<name>/SKILL.md` with `name` and `description` front matter, add a row to the Task Router, and add `.opencode/commands/<name>.md` (copy an existing one).
