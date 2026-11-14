export const checks = [
  {
    name: "footer says 2023-2026",
    run: ({ read }) => read("src/components/Footer.js").includes("© 2023-2026") || "footer year not updated",
  },
  {
    name: "HOPE CHURCH is in both partner lists with yes.png",
    run: ({ liveLines }) => {
      const lines = liveLines("src/components/PartnersSection.js").join("\n");
      const count = (lines.match(/PartnerDisplayBox\(\s*"images\/yes\.png",\s*"HOPE CHURCH"/g) ?? []).length;
      return count === 2 || `found ${count} of 2`;
    },
  },
  {
    name: "English join-us title fixed, Chinese unchanged",
    run: ({ translations }) => {
      const t = translations();
      if (t.en.joinUs.title !== "Join us in CityServe 2026") return `en is "${t.en.joinUs.title}"`;
      return t.zh.joinUs.title === "一同參與CityServe2026" || `zh changed to "${t.zh.joinUs.title}"`;
    },
  },
  {
    name: "only the expected files changed",
    run: ({ changedFiles }) => {
      const allowed = ["src/components/Footer.js", "src/components/PartnersSection.js", "src/components/Translation.js"];
      const extra = changedFiles().filter((file) => file.startsWith("src/") && !allowed.includes(file));
      return extra.length === 0 || `also changed ${extra.join(", ")}`;
    },
  },
];
