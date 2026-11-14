export const checks = [
  {
    name: "planted width removed",
    run: ({ read }) => !read("src/components/ReCap.js").includes('base: "14rem", lg: "11.95rem"') || "recap cards are still 14rem on phones",
  },
  {
    name: "desktop sizes unchanged",
    run: ({ read }) => /lg: "11\.95rem", xl: "13\.75rem"/.test(read("src/components/ReCap.js")) || "desktop card widths changed",
  },
  {
    name: "only ReCap.js changed",
    run: ({ changedFiles }) => {
      const extra = changedFiles().filter((file) => file.startsWith("src/") && file !== "src/components/ReCap.js");
      return extra.length === 0 || `also changed ${extra.join(", ")}`;
    },
  },
];
