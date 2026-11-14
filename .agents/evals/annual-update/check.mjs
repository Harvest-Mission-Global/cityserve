const allValues = (object, prefix = "") =>
  Object.entries(object).flatMap(([key, value]) =>
    value && typeof value === "object" ? allValues(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]],
  );

const expectEqual = (actual, expected, label) => actual === expected || `${label} is "${actual}"`;
const expectIncludes = (actual, needle, label) =>
  (typeof actual === "string" && actual.includes(needle)) || `${label} is "${actual}" (should contain "${needle}")`;

export const checks = [
  {
    name: "event date and promo say 2027",
    run: ({ translations }) => {
      const t = translations();
      return [
        expectEqual(t.en.about.date, "MARCH 12-14, 2027", "en.about.date"),
        expectEqual(t.zh.about.date, "2027年 3月12-14日", "zh.about.date"),
        expectEqual(t.en.about.promo, "ARE YOU READY FOR CITYSERVE 2027?", "en.about.promo"),
        expectIncludes(t.zh.about.promo, "2027", "zh.about.promo"),
      ].find((result) => result !== true) ?? true;
    },
  },
  {
    name: "join-us title and text say CityServe 2027",
    run: ({ translations }) => {
      const t = translations();
      return [
        expectEqual(t.en.joinUs.title, "Join us in CityServe 2027", "en.joinUs.title"),
        expectIncludes(t.zh.joinUs.title, "2027", "zh.joinUs.title"),
        expectIncludes(t.en.joinUs.description, "CityServe 2027", "en.joinUs.description"),
        expectIncludes(t.zh.joinUs.description, "2027", "zh.joinUs.description"),
      ].find((result) => result !== true) ?? true;
    },
  },
  {
    name: "recap texts say 2026",
    run: ({ translations }) => {
      const t = translations();
      return [
        expectEqual(t.en.header.recap, "2026 RECAP", "en.header.recap"),
        expectIncludes(t.zh.header.recap, "2026", "zh.header.recap"),
        expectIncludes(t.en.about.recap, "2026", "en.about.recap"),
        expectIncludes(t.zh.about.recap, "2026", "zh.about.recap"),
        expectEqual(t.en.recap.title, "A RECAP OF CITYSERVE 2026", "en.recap.title"),
        expectIncludes(t.zh.recap.title, "2026", "zh.recap.title"),
        expectIncludes(t.en.recap.description, "The 2026 CityServe took place from Friday to Sunday, March 20-22.", "en.recap.description"),
        expectIncludes(t.zh.recap.description, "2026", "zh.recap.description"),
      ].find((result) => result !== true) ?? true;
    },
  },
  {
    name: "no leftover 2025, and 2026 only in recap texts",
    run: ({ translations }) => {
      const t = translations();
      const recapKeys = /^(header\.recap|about\.recap|recap\.)/;
      const wrong = ["en", "zh"].flatMap((lang) =>
        allValues(t[lang])
          .filter(([key, value]) => typeof value === "string" && (value.includes("2025") || (value.includes("2026") && !recapKeys.test(key))))
          .map(([key]) => `${lang}.${key}`),
      );
      return wrong.length === 0 || `old year in ${wrong.join(", ")}`;
    },
  },
  {
    name: "recap numbers 337, 14, 15, 707",
    run: ({ read }) => {
      const numbers = [...read("src/components/ReCap.js").matchAll(/number:\s*"(\d+)"/g)].map((match) => match[1]);
      return numbers.join(",") === "337,14,15,707" || `numbers are ${numbers.join(", ")}`;
    },
  },
  {
    name: "NGOs label renamed in both languages",
    run: ({ translations }) => {
      const t = translations();
      if (!/^partner organizations?$/i.test(t.en.recap.ngos)) return `en.recap.ngos is "${t.en.recap.ngos}"`;
      return expectEqual(t.zh.recap.ngos, "夥伴組織", "zh.recap.ngos");
    },
  },
  {
    name: "only Translation.js and ReCap.js changed",
    run: ({ changedFiles }) => {
      const allowed = ["src/components/Translation.js", "src/components/ReCap.js"];
      const extra = changedFiles().filter((file) => (file.startsWith("src/") || file.startsWith("public/")) && !allowed.includes(file));
      return extra.length === 0 || `also changed ${extra.join(", ")}`;
    },
  },
];
