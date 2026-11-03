import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("starter document exposes dashboard regions and module entry point", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /<main>/);
  assert.match(html, /aria-label="Event overview"/);
  assert.match(html, /id="event-grid"/);
  assert.match(html, /type="module" src="src\/app\.js"/);
});
