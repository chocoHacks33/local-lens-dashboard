import test from "node:test";
import assert from "node:assert/strict";

import {
  loadSavedEventIds,
  SAVED_EVENTS_KEY,
  saveSavedEventIds,
  toggleSavedEvent
} from "../src/features/saved-events.js";

function createStorage(initialValue) {
  const values = new Map(initialValue === undefined ? [] : [[SAVED_EVENTS_KEY, initialValue]]);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    value: (key) => values.get(key)
  };
}

test("saved ids are limited to known events and deduplicated", () => {
  const storage = createStorage(JSON.stringify(["first", "missing", "first"]));

  assert.deepEqual([...loadSavedEventIds(storage, ["first", "second"])], ["first"]);
});

test("invalid stored data falls back to an empty selection", () => {
  const storage = createStorage("not-json");

  assert.deepEqual([...loadSavedEventIds(storage, ["first"])], []);
});

test("toggle returns a new set and save writes stable JSON", () => {
  const original = new Set(["second"]);
  const withFirst = toggleSavedEvent(original, "first");
  const withoutSecond = toggleSavedEvent(withFirst, "second");
  const storage = createStorage();

  saveSavedEventIds(storage, withFirst);

  assert.deepEqual([...original], ["second"]);
  assert.deepEqual([...withFirst].sort(), ["first", "second"]);
  assert.deepEqual([...withoutSecond], ["first"]);
  assert.equal(storage.value(SAVED_EVENTS_KEY), '["first","second"]');
});
