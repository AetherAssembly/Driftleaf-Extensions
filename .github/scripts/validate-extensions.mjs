#!/usr/bin/env node
// Validate extension files: syntax, the 512 KB size limit Driftleaf enforces at
// install time, and a few patterns CONTRIBUTING.md asks extensions to avoid.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const MAX_EXTENSION_BYTES = 512 * 1024;

export const FORBIDDEN_PATTERNS = [
  { pattern: /\.innerHTML\s*=/, name: "an innerHTML assignment" },
  { pattern: /\.outerHTML\s*=/, name: "an outerHTML assignment" },
  { pattern: /\.insertAdjacentHTML\s*\(/, name: "insertAdjacentHTML" },
  { pattern: /document\.write\s*\(/, name: "document.write" },
  { pattern: /\beval\s*\(/, name: "eval" },
  { pattern: /new\s+Function\s*\(/, name: "the Function constructor" },
];

// Pure checks (no filesystem/process access), so they're easy to unit test directly.

export function checkSize(bytes) {
  if (bytes.length > MAX_EXTENSION_BYTES) {
    return `is ${bytes.length} bytes, over the ${MAX_EXTENSION_BYTES}-byte (512 KB) limit Driftleaf enforces at install time`;
  }
  return null;
}

export function checkForbiddenPatterns(text) {
  return FORBIDDEN_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(
    ({ name }) => `uses ${name}; use DOM textContent for vault data instead`,
  );
}

export function checkSyntax(filePath) {
  try {
    execFileSync(process.execPath, ["--check", filePath], { stdio: "pipe" });
    return null;
  } catch (error) {
    const message = error.stderr ? error.stderr.toString().trim() : error.message;
    return `failed a syntax check: ${message}`;
  }
}

export function validateFile(filePath) {
  const bytes = readFileSync(filePath);
  const errors = [checkSize(bytes), checkSyntax(filePath)].filter((error) => error !== null);
  errors.push(...checkForbiddenPatterns(bytes.toString("utf8")));
  return errors;
}

function main(extensionsDir) {
  const files = readdirSync(extensionsDir)
    .filter((name) => name.endsWith(".js"))
    .sort();
  if (files.length === 0) {
    console.error(`No .js files found in ${extensionsDir}`);
    return 1;
  }

  let failed = false;
  for (const file of files) {
    const errors = validateFile(path.join(extensionsDir, file));
    if (errors.length === 0) {
      console.log(`Validated ${file}`);
    } else {
      failed = true;
      for (const error of errors) console.error(`${file}: ${error}`);
    }
  }
  return failed ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const extensionsDir = process.argv[2] ?? "extensions";
  process.exit(main(extensionsDir));
}
