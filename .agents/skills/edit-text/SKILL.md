---
name: edit-text
description: Change, add, or fix any text that visitors see on the cityserve site, in English and Traditional Chinese, through src/components/Translation.js. Use for wording changes, typos, new labels or paragraphs, and translation fixes.
---

# edit-text

All visible text lives in `src/components/Translation.js`. It has two blocks with **the same keys**:

```javascript
const translations = {
  en: {
    joinUs: {
      title: "Join us in Cityserve 2025",
    },
  },
  zh: {
    joinUs: {
      title: "一同參與CityServe2025",
    },
  },
};
```

Components read it with `translations[language].joinUs.title`.

## A. Change existing text

1. Find the text. Search for a few words of it:

   ```bash
   rg -n "Join us in" src
   ```

2. If it is in `Translation.js`, change the value in `en` **and** the matching value in `zh`.
3. If it is typed directly in a component (for example a partner name), change it there. Keep it in the same place.
4. Change only the words you were asked to change. Keep the capital letters, spacing, and punctuation style of the text around it.

## B. Add new text

1. Choose the section object that matches the component (`header`, `about`, `socialNeed`, `joinUs`, `recap`, `participate`, `partners`). Use a top-level key only for text used in many sections.
2. Choose a `camelCase` key that says what the text is: `registerButton`, `promoTitle`. Do not use numbers alone (`text2`).
3. Add the key to `en` **and** to `zh`, in the same position in both blocks.
4. Use it in the component:

   ```javascript
   import { useLanguage } from "./LanguageToggle";
   import translations from "./Translation";

   const MySection = () => {
     const { language } = useLanguage();
     return <Text>{translations[language].joinUs.registerButton}</Text>;
   };
   ```

5. Never put visible words directly in JSX, for example `<Text>Register now</Text>`.

## Chinese rules

- Use **Traditional Chinese as written in Hong Kong (繁體中文)**. Never Simplified: `該` not `该`, `關閉` not `关闭`, `會` not `会`, `參與` not `参与`.
- If the human or the issue gives you the Chinese text, copy it exactly.
- If you must translate yourself, keep the meaning, not word-for-word English. Keep `CityServe` in English.
- If you are not sure your Chinese is right, still add it, then write the key under **Needs a human** in your report and PR.

## Check

```bash
yarn check:content
```

It fails if a key is in one language only, a value is empty, a `zh` value has Simplified characters, or the code uses a key that does not exist. Then run the full `verify` skill (`.agents/skills/verify/SKILL.md`), and look at the text in both languages: Chinese text is often longer or shorter, so check that it still fits on mobile.
