---
name: event-update
description: Update the cityserve site for a new event year or a new phase - event dates, year numbers, recap numbers and video, promo video, and opening or closing the interest, church, and registration forms. Use for "update the site for 2027", "open registration", "close the forms", or "change the form link".
---

# event-update

The site is reused every year. The same facts appear in many places, so **search, do not guess**.

## Before you start

Get these from the human or the issue. **Do not invent any of them.** If one is missing and the task needs it, stop and ask.

| Fact | Example |
| --- | --- |
| Event year and dates, in English and Chinese | `MARCH 19-21, 2027` / `2027年 3月19-21日` |
| Last year's recap numbers | participants, churches, NGOs, people reached |
| Recap video link (YouTube) | `https://www.youtube.com/watch?v=XXXXXXXXXXX` |
| Promo video link (YouTube), if it changes | |
| Which forms are open or closed, and their links | interest form, church form, registration form |

## 1. Find every place

```bash
rg -n "2024|2025|2026|2027" src
rg -n "forms.gle|tithe.ly|youtube.com|mailto:" src
rg -n "isDisabled" src
```

Write the list of hits in your reply before you change anything. Here is what you will usually find:

| What | Where |
| --- | --- |
| Event date | `Translation.js` → `about.date` (en and zh) |
| Year in titles and paragraphs | `Translation.js` → `header.recap`, `about.promo`, `about.recap`, `joinUs.*`, `recap.*` (en and zh) |
| Recap numbers | `src/components/ReCap.js` → the `number` values in `cardsData` |
| Recap video | `src/components/ReCap.js` → `<iframe src=...>` |
| Promo video | `src/components/AboutSection.js` → **two** `<iframe>` elements (desktop and mobile). Change both. |
| Copyright years | `src/components/Footer.js` → `© 2023-2025 ...` |
| Form buttons | `Header.js` (desktop **and** mobile), `AboutSection.js`, `JoinUsSection.js`, `ParticipateSection.js` |

## 2. Change the text

- Follow `.agents/skills/edit-text/SKILL.md`. Change `en` and `zh` together.
- Last year's event goes in the recap text. Next year's event goes in the date, promo, and join-us text. Read each sentence and decide which year it talks about.
- Recap numbers are strings: `number: "296"`.

## 3. YouTube links

A page iframe needs the **embed** form of the link:

| The human gives | Put in `src` |
| --- | --- |
| `https://www.youtube.com/watch?v=ABC123xyz00` | `https://www.youtube.com/embed/ABC123xyz00` |
| `https://youtu.be/ABC123xyz00` | `https://www.youtube.com/embed/ABC123xyz00` |

## 4. Open or close a form

Every form button follows one pattern. To **close** a form (example from `Header.js`):

```javascript
<Button
  // href="https://forms.gle/ucGjxo2caEK36wYb6"
  as={Link}
  target="_blank"
  isDisabled
>
  {translations[language].interestForm}
</Button>
```

and the button text in `Translation.js` says it is closed (`en: "CLOSED"`, `zh: "此表格已關閉"`).

To **open** a form, do the reverse:

1. Remove `//` from the `href` line and put the new link there.
2. Remove the `isDisabled` line.
3. Change the button text in `Translation.js` back to the form name, in `en` and `zh` (ask the human for the wording).

Do this for **every** button of that form. These are the form buttons today:

| Form | Buttons | Label key in `Translation.js` |
| --- | --- | --- |
| Interest form | `Header.js` (desktop and mobile), `AboutSection.js`, `ParticipateSection.js` | `interestForm` |
| Interest form | `JoinUsSection.js` | `joinUs.button_registration` (a different key for the same form) |
| Church form | `ParticipateSection.js`, the "for churches" button | `church_interestForm` |

Code inside `{/* ... */}` is switched off and is **not** on the page. `JoinUsSection.js` has a large switched-off block with another form button and a live-looking link. `rg` finds it too: ignore hits inside `{/* ... */}` unless the human asks you to switch that block back on.

Use `rg -n "<the form link>" src` and `rg -n "isDisabled" src` to make sure no button is left behind.

When you finish, every button of one form must agree: all open with the same link, or all closed.

## 5. Check

Run the `verify` skill (`.agents/skills/verify/SKILL.md`). Also:

- Click every form button you opened. It must open the right form in a new tab.
- Play the videos you changed.
- In your report, list each changed fact with its old and new value.
