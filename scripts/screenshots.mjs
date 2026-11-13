#!/usr/bin/env node
// Visual check for agents without a browser: yarn screenshots [--no-build]
import { spawnSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const BUILD_DIR = join(process.cwd(), "build");
const OUT_DIR = join(process.cwd(), "screenshots");
const PARTS_DIR = join(OUT_DIR, "parts");
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
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
  problems.set(message, [...(problems.get(message) ?? []), view]);

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

if (problems.size > 0) {
  console.error(`\nscreenshots: ${problems.size} problem(s) found`);
  for (const [message, views] of [...problems].slice(0, 15)) {
    console.error(`  - ${message}  [${views.join(", ")}]`);
  }
  if (problems.size > 15) console.error(`  ...and ${problems.size - 15} more. Fix these first.`);
  console.error("\nscreenshots: FAILED");
  process.exit(1);
}
console.log(
  "\nscreenshots: PASSED (no console errors, missing files, sideways scrolling, cut-off text, broken images, or overlapping buttons)",
);
