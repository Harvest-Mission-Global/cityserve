# Add a new FAQ section

[Text] Add a FAQ section

### Where on the page

Other (say where below): a new section directly below "How can you take part", above the second "Join us" block.

### New text (English)

Title: FREQUENTLY ASKED QUESTIONS
Intro: Answers to the questions we hear most.
Q1: Who can join? Anyone can join through a church or a partner organisation.
Q2: Does it cost anything? No, taking part is free.
Q3: What should I bring? Water, comfortable shoes, and a willing heart.

### New text (繁體中文)

Title: 常見問題
Intro: 我們最常收到的問題和解答。
Q1: 誰可以參加？任何人都可以透過教會或合作機構參加。
Q2: 參加需要費用嗎？不需要，參加是免費的。
Q3: 我需要帶甚麼？食水、舒適的鞋子，和一顆願意的心。

## Expected

- A new component file with the section, placed right after the take-part section in `HomeContainer.js`.
- All text in `Translation.js` in both languages, copied exactly.
- The section follows the standard: theme text styles (`textStyle="sectionTitle"`), theme colours, the three questions from data with `.map()` and a stable `key`, one responsive layout.

## Check by hand

- Open `screenshots/parts/mobile-en-*.png` and `desktop-zh-*.png` around the new section: it looks like part of the site (background differs from its neighbours, same title style).
