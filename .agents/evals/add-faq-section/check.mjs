import { readdirSync } from "node:fs";

const ORIGINAL_COMPONENTS = [
  "AboutSection.js", "Footer.js", "Header.js", "HomeContainer.js", "JoinUsSection.js",
  "LanguageToggle.js", "MainContainer.js", "ParticipateSection.js", "PartnersSection.js",
  "ReCap.js", "SocialNeedSection.js", "Translation.js",
];

const newComponent = (read) => {
  const file = readdirSync("src/components").find((name) => name.endsWith(".js") && !ORIGINAL_COMPONENTS.includes(name));
  return file ? { file, text: read(`src/components/${file}`) } : null;
};

const allValues = (object) =>
  Object.values(object).flatMap((value) => (value && typeof value === "object" ? allValues(value) : [value]));

export const checks = [
  {
    name: "new section component exists",
    run: ({ read }) => Boolean(newComponent(read)) || "no new file in src/components",
  },
  {
    name: "placed right after the take-part section",
    run: ({ read }) => {
      const component = newComponent(read);
      if (!component) return "no new component";
      const name = component.file.replace(".js", "");
      const home = read("src/components/HomeContainer.js");
      return new RegExp(`<ParticipateSection[^>]*/>\\s*<${name}[\\s/>]`).test(home) || `<${name} /> is not right after <ParticipateSection />`;
    },
  },
  {
    name: "English and Chinese text copied exactly",
    run: ({ translations }) => {
      const t = translations();
      const en = allValues(t.en).join("\n");
      const zh = allValues(t.zh).join("\n");
      const missing = [
        ["en", en, "FREQUENTLY ASKED QUESTIONS"],
        ["en", en, "No, taking part is free."],
        ["zh", zh, "常見問題"],
        ["zh", zh, "不需要，參加是免費的。"],
      ].filter(([, text, needle]) => !text.includes(needle));
      return missing.length === 0 || `missing: ${missing.map(([lang, , needle]) => `${lang} "${needle}"`).join(", ")}`;
    },
  },
  {
    name: "uses theme text style and colours",
    run: ({ read }) => {
      const component = newComponent(read);
      if (!component) return "no new component";
      if (!component.text.includes('textStyle="sectionTitle"')) return 'title does not use textStyle="sectionTitle"';
      return /brand\.\w+|"white"/.test(component.text) || "no theme colour used";
    },
  },
  {
    name: "questions rendered from data with .map()",
    run: ({ read }) => {
      const component = newComponent(read);
      if (!component) return "no new component";
      return /\.map\(/.test(component.text) && /key=\{/.test(component.text) || "questions are not built with .map() and key";
    },
  },
];
