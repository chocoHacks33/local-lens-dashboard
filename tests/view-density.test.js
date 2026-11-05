import test from "node:test";
import assert from "node:assert/strict";

import {
  DENSITY_STORAGE_KEY,
  nextDensity,
  normalizeDensity,
  readDensity,
  writeDensity
} from "../src/features/view-density.js";

test("density values normalize to a comfortable default", () => {
  assert.equal(normalizeDensity("compact"), "compact");
  assert.equal(normalizeDensity("comfortable"), "comfortable");
  assert.equal(normalizeDensity("unexpected"), "comfortable");
});

test("density toggles between the two supported layouts", () => {
  assert.equal(nextDensity("comfortable"), "compact");
  assert.equal(nextDensity("compact"), "comfortable");
});

test("density preference can be read and written", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };

  assert.equal(readDensity(storage), "comfortable");
  writeDensity(storage, "compact");
  assert.equal(values.get(DENSITY_STORAGE_KEY), "compact");
  assert.equal(readDensity(storage), "compact");
});

test("blocked browser storage falls back without throwing", () => {
  const storage = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    }
  };

  assert.equal(readDensity(storage), "comfortable");
  assert.doesNotThrow(() => writeDensity(storage, "compact"));
});
