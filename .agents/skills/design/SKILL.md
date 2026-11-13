---
name: design
description: How the CityServe site should look - section layout, text styles, buttons, cards, colours, images, and what to avoid. Use for any visual change, new section, new card or button, or layout fix, so new parts match the site instead of looking generic.
---

# design

The site is a bold, simple, poster-like page: tall Antonio titles in capitals, calm Manrope text, flat colour blocks, and lots of space. New parts must look like they were always there.

## Page structure

- The page is a stack of **full-width sections**. Each section has one background colour from the theme.
- Neighbouring sections use **different** backgrounds. Look at the sections above and below yours before you choose.
- Content sits in a centred container:

  ```javascript
  <Box as="section" w="100%" bgColor="brand.lightBlue">
    <Container maxW="container.xl" py={{ base: 10, lg: 16 }} px={{ base: 4, md: 8, lg: 12, xl: 0 }}>
      ...
    </Container>
  </Box>
  ```

| Background | Text colour on it | Used for |
| --- | --- | --- |
| `brand.navy` | `white` or `brand.offWhite` | Strong sections: hero, "Join us" |
| `brand.lightBlue` | `brand.navy` | Calm sections, cards, footer |
| `brand.cream` | `brand.navy` | Recap, warm cards |
| `white` | `brand.navy` | Plain sections, partner cards |

## Text

Use the theme's text styles. Do not set font family, size, and weight by hand.

| Text | Code | Looks like |
| --- | --- | --- |
| Section title | `<Text as="h2" textStyle="sectionTitle">` | Antonio, bold, CAPITALS, 1.75rem on phones, 2.25rem from tablets up |
| Paragraph | `<Text textStyle="body">` | Manrope, 0.875rem on phones, 1.25rem from tablets up |
| Button text, small labels | `textStyle="label"` | Manrope, extra bold, CAPITALS, wide letter spacing |

- Keep titles short: one line on desktop, at most two on a phone.
- Paragraphs are left-aligned on phones. Centre them only from `md` up, and only if the section above does too.
- Chinese text is often shorter than English but can wrap differently. Check both languages.

## Buttons

```javascript
<Button
  as={Link}
  href="https://..."
  isExternal
  textStyle="label"
  h="3.125rem"
  px={8}
  borderRadius="button"
  bgColor="brand.blue"
  color="brand.offWhite"
  _hover={{ bgColor: "brand.navy", textDecoration: "none" }}
>
  {t.joinUs.registerButton}
</Button>
```

- On a light background, the second button style is `bgColor="brand.lightBlue"` with `color="brand.navy"`.
- Buttons sit side by side from `md` up and stack on phones: `<Stack direction={{ base: "column", md: "row" }} spacing={4}>`.
- A closed form keeps its button but uses `isDisabled` (see the `event-update` skill).

## Cards

- Same corner radius as buttons: `borderRadius="button"`.
- Flat colour (`brand.lightBlue` or `brand.cream`), or `white` with a thin border. No heavy shadows.
- A grid of cards: `<SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={{ base: 4, lg: 6 }}>`. Every card in a row is the same height.

## Images

- Logos and icons keep their shape: `objectFit="contain"`, with a fixed height (for example `h={{ base: 12, lg: 16 }}`).
- Photos fill their box: `objectFit="cover"`.
- Every image has `alt` text (see `AGENTS.md` → Content Rules).

## Do not

- Add new colours, gradients, glows, or heavy shadows.
- Use emoji as icons. Use `react-icons`.
- Make every card or block identical when one item matters most; make that one bigger.
- Put long paragraphs in capitals. Capitals are for titles, labels, and buttons.
- Use tiny text or tiny links. On phones, nothing you can tap is smaller than 24×24px.
- Put light text on a light background. `yarn screenshots` fails on low contrast.

## Check

Run the `verify` skill. For a visual change, if your model can read images and your context allows, open the `screenshots/parts/` slices that show your change (mobile first) and compare them with the sections around it.
