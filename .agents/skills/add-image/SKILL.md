---
name: add-image
description: Add, replace, or remove an image, icon, or partner logo on the cityserve site - file naming and size, the public/images path, alt text, and the separate desktop and mobile partner lists. Use for "add this partner", "replace the logo", "change the background picture".
---

# add-image

## 1. The file

- Put it in `public/images/` (or a subfolder that already exists, such as `public/images/participate/`).
- Name: lowercase, words joined with `-`, no spaces, no `&`, no Chinese characters. Good: `hope-church.png`. Bad: `Hope Church (1).PNG`.
- Format: `.svg` or `.png` for logos and icons, `.jpg` or `.webp` for photos.
- Size: keep it under 300 KB. A logo needs at most about 400px wide. If the file is bigger, ask the human for a smaller one or compress it first.
- Only use images the human or the issue gave you. Never download a logo from the internet yourself.

To **replace** an image, prefer saving the new file with a new name and changing the code to point at it. Delete the old file only if `rg -n "<old-file-name>" src public` finds no other use.

## 2. The code

```javascript
<Image
  src={process.env.PUBLIC_URL + "/images/hope-church.png"}
  alt="Hope Church logo"
/>
```

- Always start with `process.env.PUBLIC_URL + "/images/..."`. Do not `import` images from `src/`.
- File names are case-sensitive on Netlify. `Logo.png` and `logo.png` are different files.
- Give every new `<Image>` an `alt` text that says what it shows. Use `alt=""` only for decoration.

## 3. Partner logos

Partners are in `src/components/PartnersSection.js`. The list is written **twice**:

| List | Shown on | Looks like |
| --- | --- | --- |
| Desktop | `lg` and wider | `<Flex display={{ base: "none", lg: "flex" }} ...>` with `{PartnerDisplayBox(...)}` lines |
| Mobile | narrower than `lg` | `<Box display={{ base: "flex", lg: "none" }} ...>` with each `PartnerDisplayBox` inside a `<GridItem>` |

To add a partner, add one line to the desktop list:

```javascript
{PartnerDisplayBox("images/hope-church.png", "HOPE CHURCH")}
```

and one item to the mobile list, in the same position:

```javascript
<GridItem>
  {PartnerDisplayBox("images/hope-church.png", "HOPE CHURCH")}
</GridItem>
```

- The partner name must be **exactly the same** in both lists.
- To remove a partner, remove it from both lists. Ask the human first.
- Commented-out partners (`{/* ... */}`) are past partners. Leave them.

## 4. Check

```bash
yarn check:content
```

It fails if a path in the code points to a file that does not exist. Then run the `verify` skill (`.agents/skills/verify/SKILL.md`) and look at the image on desktop and on mobile: it must not be stretched, cut off, or blurry.
