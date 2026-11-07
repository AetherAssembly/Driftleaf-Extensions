import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MAX_EXTENSION_BYTES,
  checkForbiddenPatterns,
  checkSize,
} from "./validate-extensions.mjs";

test("checkSize passes a file at the limit", () => {
  assert.equal(checkSize(Buffer.alloc(MAX_EXTENSION_BYTES)), null);
});

test("checkSize fails a file over the limit", () => {
  const error = checkSize(Buffer.alloc(MAX_EXTENSION_BYTES + 1));
  assert.match(error, /512 KB/);
});

test("checkForbiddenPatterns flags innerHTML assignment", () => {
  const errors = checkForbiddenPatterns('main.innerHTML = "<b>hi</b>";');
  assert.equal(errors.length, 1);
  assert.match(errors[0], /innerHTML/);
});

test("checkForbiddenPatterns flags eval and the Function constructor", () => {
  const errors = checkForbiddenPatterns('eval("1+1"); new Function("return 1");');
  assert.equal(errors.length, 2);
});

test("checkForbiddenPatterns passes ordinary DOM usage", () => {
  const errors = checkForbiddenPatterns('el.textContent = note.title; const e = eval_result;');
  assert.deepEqual(errors, []);
});
