---
name: add-section
description: Add a new section to the cityserve one-page site - create the component file, add its text in English and Traditional Chinese, place it in HomeContainer, and optionally link it from the header. Use for "add a FAQ section", "add a sponsors block", or any new block on the page.
---

# add-section

Ask the human first if any of these are unknown: where the section goes on the page, the text in both languages, the images, and whether the header needs a link to it.

## 1. Look at a similar section first

Open the existing section that looks most like the new one (for example `ReCap.js` for cards, `JoinUsSection.js` for buttons). Match how it **looks** on the page: width, background, title size, spacing. Do **not** copy how it is **written**: old sections use raw hex colours, raw `rem` values, and mobile/desktop copies. Write the new section to `#code-standard` and `#styling-standard` in `AGENTS.md`. Say in your reply which section you matched.

## 2. Add the text

Add a new object to **both** `en` and `zh` in `src/components/Translation.js` (see `.agents/skills/edit-text/SKILL.md`):

```javascript
// in en
faq: {
  title: "FREQUENTLY ASKED QUESTIONS",
  description: "Answers to the questions we hear most.",
  whoCanJoin: "Anyone can join through a church or an NGO.",
  isItFree: "Yes, taking part is free.",
  whatToBring: "Bring water and comfortable shoes.",
},
// in zh
faq: {
  title: "常見問題",
  description: "我們最常收到的問題和解答。",
  whoCanJoin: "任何人都可以透過教會或機構參加。",
  isItFree: "是的，參加是免費的。",
  whatToBring: "請帶備食水和舒適的鞋子。",
},
```

## 3. Create the component

Create `src/components/FaqSection.js`. Start from this template:

```javascript
import { Container, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { forwardRef } from "react";
import { useLanguage } from "./LanguageToggle";
import translations from "./Translation";

const QUESTION_KEYS = ["whoCanJoin", "isItFree", "whatToBring"];

const FaqSection = forwardRef((props, ref) => {
  const { language } = useLanguage();
  const t = translations[language].faq;

  return (
    <Container
      ref={ref}
      maxW="container.xl"
      py={{ base: 10, lg: 16 }}
      px={{ base: 4, md: 8, lg: 12, xl: 0 }}
    >
      <VStack alignItems="flex-start" spacing={4} color="brand.navy">
        <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }}>
          {t.title}
        </Heading>
        <Text fontSize={{ base: "sm", md: "xl" }}>{t.description}</Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="100%">
          {QUESTION_KEYS.map((key) => (
            <Text key={key} bgColor="brand.lightBlue" p={4} borderRadius="lg">
              {t[key]}
            </Text>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
});

export default FaqSection;
```

The template shows the standard: theme colours (`brand.navy`), `Heading as="h2"` (theme font), the Chakra spacing scale, one responsive layout (`columns={{ base: 1, md: 3 }}`), and a list from data with a stable `key`.

- Keep `forwardRef` only if the header will scroll to this section. Otherwise use a plain arrow function and remove `ref`.
- Use only the colours and fonts in `AGENTS.md` → `#styling-standard`.

## 4. Put it on the page

Import it in `src/components/HomeContainer.js` and place it in the `<VStack>` where the human wants it:

```javascript
import FaqSection from "./FaqSection";
// ...
<ParticipateSection ref={participateRef} />
<FaqSection />
<JoinUsSection />
```

## 5. Header link (only if asked)

1. In `MainContainer.js`: add `const faqRef = useRef(null);` and pass `faqRef` to both `Header` and `HomeContainer`.
2. In `HomeContainer.js`: accept `faqRef` and pass it as `<FaqSection ref={faqRef} />`.
3. In `Header.js`: add a scroll function like `scrollToRecap`, and add the link in **both** the desktop menu and the mobile menu.
4. Add the link text to `Translation.js` → `header` in `en` and `zh`.

## 6. Check

Run the `verify` skill (`.agents/skills/verify/SKILL.md`). Look at the new section and the sections above and below it, on desktop and mobile, in both languages.
