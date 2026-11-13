#!/usr/bin/env node
// Visual check for agents without a browser: yarn screenshots [--no-build]
import { spawnSync } from "node:child_process";
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const BUILD_DIR = join(process.cwd(), "build");
const OUT_DIR = join(process.cwd(), "screenshots");
const PARTS_DIR = join(OUT_DIR, "parts");
const BASELINE_FILE = join(process.cwd(), "scripts", "page-check-baseline.json");
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, saveImages: true },
  { name: "mobile", width: 390, height: 844, saveImages: true, checkTapTargets: true },
  { name: "narrow", width: 320, height: 640, saveImages: false, checkTapTargets: true },
];
const LANGUAGES = [
  { name: "en", toggle: "EN" },
  { name: "zh", toggle: "繁" },
];
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const run = (command, args) =>
  spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, CI: "true", BROWSERSLIST_IGNORE_OLD_DATA: "true" },
  }).status === 0;

const serveBuild = () =>
  new Promise((resolve) => {
    const server = createServer((request, response) => {
      const path = decodeURIComponent(new URL(request.url, "http://x").pathname);
      const file = normalize(join(BUILD_DIR, path));
      const isFile = file.startsWith(BUILD_DIR) && existsSync(file) && statSync(file).isFile();
      if (!isFile && extname(path)) {
        response.writeHead(404).end();
        return;
      }
      const target = isFile ? file : join(BUILD_DIR, "index.html");
      response.writeHead(200, {
        "Content-Type": MIME_TYPES[extname(target)] ?? "application/octet-stream",
      });
      createReadStream(target).pipe(response);
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });

const launchBrowser = async () => {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    try {
      return await chromium.launch();
    } catch {
      console.error(
        "screenshots: no browser found. Install Google Chrome, or run: yarn playwright install chromium",
      );
      process.exit(1);
    }
  }
};

const findOverflow = (page) =>
  page.evaluate(() => {
    const limit = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth <= limit + 1) return [];
    const isTooWide = (element) => element.getBoundingClientRect().right > limit + 1;
    return [...document.querySelectorAll("body *")]
      .filter((element) => isTooWide(element) && ![...element.children].some(isTooWide))
      .slice(0, 5)
      .map((element) => {
        const text = (element.textContent ?? "").trim().slice(0, 40);
        return `<${element.tagName.toLowerCase()}> ${Math.round(element.getBoundingClientRect().right)}px wide${text ? ` ("${text}")` : ""}`;
      });
  });

const findLayoutProblems = (page) =>
  page.evaluate(() => {
    const isShown = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.opacity !== "0";
    };
    const describe = (element) => {
      const text = (element.textContent || element.getAttribute("alt") || element.getAttribute("src") || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 40);
      return `<${element.tagName.toLowerCase()}>${text ? ` "${text}"` : ""}`;
    };
    const problems = [];

    for (const element of document.querySelectorAll("body *")) {
      const hasOwnText = [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      );
      if (!hasOwnText || !isShown(element) || getComputedStyle(element).display === "inline") continue;
      if (element.scrollWidth > element.clientWidth + 2) {
        problems.push(`text does not fit its box (cut off or spilling out): ${describe(element)}`);
      }
    }

    for (const image of document.querySelectorAll("img")) {
      if (isShown(image) && image.complete && image.naturalWidth === 0) {
        problems.push(`image did not load: ${describe(image)}`);
      }
    }

    const isFixed = (element) => {
      for (let node = element; node; node = node.parentElement) {
        if (getComputedStyle(node).position === "fixed") return true;
      }
      return false;
    };
    const clickables = [...document.querySelectorAll("a, button")].filter(isShown);
    for (const [index, first] of clickables.entries()) {
      for (const second of clickables.slice(index + 1)) {
        if (first.contains(second) || second.contains(first) || isFixed(first) !== isFixed(second)) continue;
        const a = first.getBoundingClientRect();
        const b = second.getBoundingClientRect();
        const overlapWidth = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapHeight = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (overlapWidth > 4 && overlapHeight > 4) {
          problems.push(`buttons or links overlap: ${describe(first)} and ${describe(second)}`);
        }
      }
    }
    return problems;
  });

const findAccessibilityProblems = (page, checkTapTargets) =>
  page.evaluate((checkTapTargets) => {
    const isShown = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.opacity !== "0";
    };
    const describe = (element) => {
      const text = (element.textContent || element.getAttribute("alt") || element.getAttribute("src") || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 40);
      return `<${element.tagName.toLowerCase()}>${text ? ` "${text}"` : ""}`;
    };
    const parseColor = (value) => {
      const [r, g, b, a = 1] = (value.match(/[\d.]+/g) ?? []).map(Number);
      return { r, g, b, a };
    };
    const luminance = ({ r, g, b }) => {
      const channel = (c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };
    const backgroundOf = (element) => {
      for (let node = element; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.backgroundImage !== "none") return null;
        const color = parseColor(style.backgroundColor);
        if (color.a >= 0.99) return color;
        if (color.a > 0) return null;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };
    const problems = [];

    if (!document.documentElement.getAttribute("lang")) problems.push("the <html> element has no lang attribute");

    for (const element of document.querySelectorAll("body *")) {
      const ownText = [...element.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .join("");
      if (!ownText || !isShown(element)) continue;
      const style = getComputedStyle(element);
      const text = parseColor(style.color);
      const background = backgroundOf(element);
      if (!background || text.a < 0.99) continue;
      const [light, dark] = [luminance(text), luminance(background)].sort((x, y) => y - x);
      const ratio = (light + 0.05) / (dark + 0.05);
      const size = parseFloat(style.fontSize);
      const isLarge = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
      const needed = isLarge ? 3 : 4.5;
      if (ratio < needed) {
        problems.push(
          `text colour too close to its background (contrast ${ratio.toFixed(1)}:1, needs ${needed}:1): ${describe(element)}`,
        );
      }
    }

    for (const element of document.querySelectorAll("a, button")) {
      if (!isShown(element)) continue;
      const name =
        element.textContent.trim() ||
        element.getAttribute("aria-label") ||
        element.getAttribute("title") ||
        [...element.querySelectorAll("img")].map((image) => image.getAttribute("alt")).join("").trim();
      if (!name) problems.push(`button or link has no name for screen readers: ${element.outerHTML.slice(0, 80)}`);
      if (checkTapTargets) {
        const rect = element.getBoundingClientRect();
        const isInsideText = [...(element.parentElement?.childNodes ?? [])].some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
        );
        if (!isInsideText && (rect.width < 24 || rect.height < 24)) {
          problems.push(
            `button or link too small to tap (${Math.round(rect.width)}x${Math.round(rect.height)}px, needs 24x24): ${describe(element)}`,
          );
        }
      }
    }

    for (const image of document.querySelectorAll("img")) {
      if (isShown(image) && !image.hasAttribute("alt")) {
        problems.push(`image has no alt text: ${describe(image)}`);
      }
    }
    return problems;
  }, checkTapTargets);

if (!process.argv.includes("--no-build") || !existsSync(BUILD_DIR)) {
  console.log("screenshots: building the site...");
  if (!run("yarn", ["-s", "build"])) {
    console.error("screenshots: FAILED (the build failed; run `yarn verify` first)");
    process.exit(1);
  }
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(PARTS_DIR, { recursive: true });
const server = await serveBuild();
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await launchBrowser();
const problems = new Map();
const report = (view, message) =>
  problems.set(message, [...new Set([...(problems.get(message) ?? []), view])]);

for (const viewport of VIEWPORTS) {
  for (const language of LANGUAGES) {
    const label = `${viewport.name} ${language.name}`;
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
    });
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) {
        report(label, `console error: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => report(label, `page crashed: ${error.message}`));
    page.on("response", (response) => {
      if (response.url().startsWith(origin) && response.status() >= 400) {
        report(label, `${response.status()} for ${response.url().slice(origin.length)}`);
      }
    });
    await page.route("**/*", (route) =>
      route.request().url().startsWith(origin) ? route.continue() : route.abort(),
    );

    await page.goto(origin, { waitUntil: "networkidle" });
    await page.getByText(language.toggle, { exact: true }).locator("visible=true").first().click();
    await page.waitForTimeout(300);

    for (const element of await findOverflow(page)) {
      report(label, `page scrolls sideways; too wide: ${element}`);
    }
    for (const problem of await findLayoutProblems(page)) {
      report(label, problem);
    }
    for (const problem of await findAccessibilityProblems(page, Boolean(viewport.checkTapTargets))) {
      report(label, problem);
    }

    if (!viewport.saveImages) {
      await page.close();
      continue;
    }
    const name = `${viewport.name}-${language.name}`;
    const file = join(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });

    // A whole page shrinks to an unreadable strip in an image viewer, so also save screen-sized parts.
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0, part = 1; y < pageHeight; y += viewport.height, part += 1) {
      const height = Math.min(viewport.height, pageHeight - y);
      await page.screenshot({
        path: join(PARTS_DIR, `${name}-${String(part).padStart(2, "0")}.png`),
        fullPage: true,
        clip: { x: 0, y, width: viewport.width, height },
      });
    }
    await page.close();
  }
}

await browser.close();
server.close();

console.log(`\nscreenshots saved in ${OUT_DIR} (whole pages) and ${PARTS_DIR} (one screen each).`);
console.log("Opening them is optional (see the verify skill: mind your context). Videos look empty on purpose.");

// The baseline lists problems the site already had, so an agent is only failed for problems it adds.
// Numbers are masked so a new year, count, or size does not turn an old problem into a "new" one.
// Each entry keeps its view, so an old problem on one screen size cannot hide a new one on another.
const baselineKey = (view, message) => `${view}: ${message.replace(/\d+(\.\d+)?/g, "#")}`;
if (process.argv.includes("--update-baseline")) {
  const keys = [
    ...new Set([...problems].flatMap(([message, views]) => views.map((view) => baselineKey(view, message)))),
  ].sort();
  writeFileSync(BASELINE_FILE, `${JSON.stringify(keys, null, 2)}\n`);
  console.log(`\nscreenshots: baseline updated with ${keys.length} known problem(s).`);
  process.exit(0);
}
const known = new Set(existsSync(BASELINE_FILE) ? JSON.parse(readFileSync(BASELINE_FILE, "utf8")) : []);
const newProblems = [...problems]
  .map(([message, views]) => [message, views.filter((view) => !known.has(baselineKey(view, message)))])
  .filter(([, views]) => views.length > 0);
const knownCount = [...problems].filter(([message, views]) =>
  views.some((view) => known.has(baselineKey(view, message))),
).length;
if (knownCount > 0) {
  console.log(`\n${knownCount} old problem(s) from before your change are listed in ${BASELINE_FILE}. Ignore them.`);
}

if (newProblems.length > 0) {
  console.error(`\nscreenshots: ${newProblems.length} new problem(s) found`);
  for (const [message, views] of newProblems.slice(0, 15)) {
    console.error(`  - ${message}  [${views.join(", ")}]`);
  }
  if (newProblems.length > 15) console.error(`  ...and ${newProblems.length - 15} more. Fix these first.`);
  console.error("\nscreenshots: FAILED");
  process.exit(1);
}
console.log("\nscreenshots: PASSED (no new page problems)");
