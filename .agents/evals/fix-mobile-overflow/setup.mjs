import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/components/ReCap.js";
const GOOD = 'width={{ base: "9.813rem", lg: "11.95rem", xl: "13.75rem" }}';
const BROKEN = 'width={{ base: "14rem", lg: "11.95rem", xl: "13.75rem" }}';

export const setup = () => {
  const text = readFileSync(FILE, "utf8");
  if (!text.includes(GOOD)) throw new Error(`${FILE} changed; update this task's setup.`);
  writeFileSync(FILE, text.replace(GOOD, BROKEN));
};
