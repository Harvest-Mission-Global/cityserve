#!/usr/bin/env node
// Checks what ESLint cannot see: en/zh translation keys, Traditional Chinese, and image paths.
// Usage: node scripts/check-content.mjs   (or: yarn check:content)
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const PUBLIC = join(ROOT, "public");
const TRANSLATION_FILE = join(SRC, "components", "Translation.js");
const LANGUAGES = ["en", "zh"];
// The site is Hong Kong Traditional Chinese (繁); these characters only exist in Simplified Chinese.
const SIMPLIFIED_ONLY = /[该关闭这们为发会对时说过还进动报门问种东车书长开见让认识请谢爱国务业电话与网络经济学习区图举灵传币义儿亲员]/g;

const errors = [];
const fail = (message) => errors.push(message);

const listJsFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listJsFiles(path);
    return /\.(js|jsx)$/.test(name) && !/\.test\.js$/.test(name) ? [path] : [];
  });

const loadTranslations = () => {
  const source = readFileSync(TRANSLATION_FILE, "utf8").replace(
    /export\s+default\s+translations\s*;?/,
    "",
  );
  return vm.runInNewContext(`${source}\ntranslations;`);
};

const flatten = (value, prefix = "") =>
  Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object"
      ? flatten(child, path)
      : [[path, child]];
  });

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

let translations;
try {
  translations = loadTranslations();
} catch (error) {
  fail(`Cannot read ${relative(ROOT, TRANSLATION_FILE)}: ${error.message}`);
}

if (translations) {
  const keySets = Object.fromEntries(
    LANGUAGES.map((lang) => [lang, new Map(flatten(translations[lang] ?? {}))]),
  );
  for (const lang of LANGUAGES) {
    if (!translations[lang]) fail(`Translation.js has no "${lang}" block.`);
  }
  for (const lang of LANGUAGES) {
    for (const other of LANGUAGES.filter((l) => l !== lang)) {
      for (const key of keySets[lang].keys()) {
        if (!keySets[other].has(key)) {
          fail(
            `Translation key "${key}" exists in "${lang}" but is missing in "${other}". Add it to the "${other}" block.`,
          );
        }
      }
    }
    for (const [key, value] of keySets[lang]) {
      if (typeof value !== "string" || value.trim() === "") {
        fail(`Translation key "${lang}.${key}" is empty or not a string.`);
      }
    }
  }
  for (const [key, value] of keySets.zh ?? []) {
    const simplified = typeof value === "string" ? value.match(SIMPLIFIED_ONLY) : null;
    if (simplified) {
      fail(
        `Translation key "zh.${key}" uses Simplified Chinese (${[...new Set(simplified)].join(" ")}). Use Traditional Chinese (繁體) characters.`,
      );
    }
  }

  const groups = Object.fromEntries(
    LANGUAGES.map((lang) => [
      lang,
      new Set(
        [...keySets[lang].keys()].flatMap((key) =>
          key.split(".").slice(0, -1).map((_, i, parts) => parts.slice(0, i + 1).join(".")),
        ),
      ),
    ]),
  );
  const keyExists = (lang, key) =>
    key === "" || typeof keySets[lang].get(key) === "string" || groups[lang].has(key);

  const PATH = "((?:\\.[A-Za-z_$][\\w$]*)*)";
  const aliasDeclaration = new RegExp(
    `(?:const|let)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*translations\\[language\\]${PATH}\\s*;`,
    "g",
  );
  const directUse = new RegExp(`translations\\[language\\]${PATH}`, "g");

  for (const file of listJsFiles(SRC)) {
    const text = readFileSync(file, "utf8");
    const uses = [...text.matchAll(directUse)].map((match) => ({
      index: match.index,
      written: `translations[language]${match[1]}`,
      key: match[1].slice(1),
    }));
    for (const [, alias, prefix] of text.matchAll(aliasDeclaration)) {
      const aliasUse = new RegExp(`(?<![\\w$.])${alias}((?:\\.[A-Za-z_$][\\w$]*)+)`, "g");
      for (const match of text.matchAll(aliasUse)) {
        uses.push({
          index: match.index,
          written: `${alias}${match[1]}`,
          key: `${prefix}${match[1]}`.slice(1),
        });
      }
    }
    for (const { index, written, key } of uses) {
      for (const lang of LANGUAGES) {
        if (!keyExists(lang, key)) {
          fail(
            `${relative(ROOT, file)}:${lineOf(text, index)} uses ${written}, but "${lang}.${key}" does not exist in Translation.js.`,
          );
        }
      }
    }
  }
}

// Netlify's file system is case-sensitive even when the local one is not.
const existsWithExactCase = (relativePath) => {
  let dir = PUBLIC;
  for (const part of relativePath.split("/")) {
    if (!existsSync(dir) || !readdirSync(dir).includes(part)) return false;
    dir = join(dir, part);
  }
  return true;
};

const imagePath =
  /["'`(]\/?(images\/[^"'`)\s]+?\.(?:png|jpe?g|svg|webp|avif|gif))["'`)]/g;
for (const file of listJsFiles(SRC)) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(imagePath)) {
    if (!existsWithExactCase(match[1])) {
      fail(
        `${relative(ROOT, file)}:${lineOf(text, match.index)} points to "${match[1]}", but public/${match[1]} does not exist. Check the file name and its upper/lower case.`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(`check-content: ${errors.length} problem(s) found\n`);
  for (const error of errors) console.error(`  - ${error}`);
  console.error("\ncheck-content: FAILED");
  process.exit(1);
}
console.log("check-content: OK (translations match, image paths exist)");
