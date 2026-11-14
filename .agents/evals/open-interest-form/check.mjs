const LINK = "https://forms.gle/TestInterest2027abc";
const FILES = [
  "src/components/Header.js",
  "src/components/AboutSection.js",
  "src/components/JoinUsSection.js",
  "src/components/ParticipateSection.js",
];

const liveCount = (liveLines, pattern) =>
  FILES.flatMap((file) => liveLines(file)).filter((line) => pattern.test(line)).length;

export const checks = [
  {
    name: "5 live interest-form links",
    run: ({ liveLines }) => {
      const count = liveCount(liveLines, new RegExp(`href=["{]?["']?${LINK.replace(/[.?]/g, "\\$&")}`));
      return count === 5 || `found ${count} of 5`;
    },
  },
  {
    name: "only the church form is still disabled",
    run: ({ liveLines }) => {
      const count = liveCount(liveLines, /^\s*isDisabled\s*$/);
      return count === 1 || `found ${count} isDisabled buttons, expected 1 (church form)`;
    },
  },
  {
    name: "church form link still commented out",
    run: ({ read }) =>
      /\/\/\s*href="https:\/\/forms\.gle\/44ri4bvJG7WuTaFf7"/.test(read("src/components/ParticipateSection.js")) ||
      "church form link was changed",
  },
  {
    name: "button text in both languages",
    run: ({ translations }) => {
      const t = translations();
      if (t.en.interestForm !== "2027 INTEREST FORM") return `en.interestForm is "${t.en.interestForm}"`;
      if (t.zh.interestForm !== "CityServe 2027 意向表格") return `zh.interestForm is "${t.zh.interestForm}"`;
      return t.en.church_interestForm === "CLOSED" || "church form text changed";
    },
  },
  {
    name: "join-us button shows the new text",
    run: ({ read, translations }) => {
      const usesInterestKey = /translations\[language\]\.interestForm/.test(read("src/components/JoinUsSection.js"));
      return usesInterestKey || translations().en.joinUs.button_registration === "2027 INTEREST FORM" || "join-us button still says CLOSED";
    },
  },
];
