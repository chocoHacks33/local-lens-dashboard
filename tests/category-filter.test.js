import test from "node:test";
import assert from "node:assert/strict";

import { events } from "../src/data.js";
import { filterEventsByCategory, getEventCategories } from "../src/features/category-filter.js";

test("category choices are unique and alphabetical", () => {
  assert.deepEqual(getEventCategories(events), [
    "Community",
    "Market",
    "Music",
    "Networking",
    "Outdoors",
    "Workshop"
  ]);
});

test("all category keeps the complete list without returning the input array", () => {
  const result = filterEventsByCategory(events, "all");

  assert.equal(result.length, events.length);
  assert.notEqual(result, events);
});

test("category matching is case insensitive", () => {
  const result = filterEventsByCategory(events, "workshop");

  assert.deepEqual(result.map((event) => event.id), ["creative-coding-lab"]);
});
