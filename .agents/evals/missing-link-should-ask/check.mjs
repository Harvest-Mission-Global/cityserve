export const checks = [
  {
    name: "no source files changed",
    noPageChecks: true,
    run: ({ changedFiles }) => {
      const changed = changedFiles().filter((file) => file.startsWith("src/") || file.startsWith("public/"));
      return changed.length === 0 || `changed ${changed.join(", ")}`;
    },
  },
  {
    name: "old church form link not switched on",
    noPageChecks: true,
    run: ({ liveLines }) =>
      !liveLines("src/components/ParticipateSection.js").some((line) => line.includes("44ri4bvJG7WuTaFf7")) ||
      "the old link was reused",
  },
];
