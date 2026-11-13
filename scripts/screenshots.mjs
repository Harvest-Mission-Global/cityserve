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
const problems = [];
const saved = [];

for (const viewport of VIEWPORTS) {
  for (const language of LANGUAGES) {
    const label = `${viewport.name} ${language.name}`;
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
    });
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) {
        problems.push(`${label}: console error: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => problems.push(`${label}: page crashed: ${error.message}`));
    page.on("response", (response) => {
      if (response.url().startsWith(origin) && response.status() >= 400) {
        problems.push(`${label}: ${response.status()} for ${response.url().slice(origin.length)}`);
      }
    });
    await page.route("**/*", (route) =>
      route.request().url().startsWith(origin) ? route.continue() : route.abort(),
    );

    await page.goto(origin, { waitUntil: "networkidle" });
    await page.getByText(language.toggle, { exact: true }).locator("visible=true").first().click();
    await page.waitForTimeout(300);

    for (const element of await findOverflow(page)) {
      problems.push(`${label}: page scrolls sideways; too wide: ${element}`);
    }

    const name = `${viewport.name}-${language.name}`;
    const file = join(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    saved.push(file);

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

console.log("\nscreenshots saved:");
for (const file of saved) console.log(`  ${file}`);
console.log(`  ${PARTS_DIR}/  <- screen-sized parts: open the ones that show what you changed`);
console.log("  Videos look empty on purpose: the script blocks outside websites such as YouTube.");

if (problems.length > 0) {
  console.error(`\nscreenshots: ${problems.length} problem(s) found`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error("\nscreenshots: FAILED");
  process.exit(1);
}
console.log("\nscreenshots: PASSED (no console errors, no missing files, no sideways scrolling)");
