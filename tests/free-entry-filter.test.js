import test from "node:test";
import assert from "node:assert/strict";

import { events } from "../src/data.js";
import { filterFreeEvents } from "../src/features/free-entry-filter.js";

test("free-entry filter keeps only zero-cost events", () => {
  const freeEvents = filterFreeEvents(events);

  assert.deepEqual(freeEvents.map((event) => event.id), [
    "tiong-bahru-art-market",
    "rail-corridor-cleanup"
  ]);
  assert.ok(freeEvents.every((event) => event.price === 0));
});

test("free-entry filter returns a new array without mutating input", () => {
  const input = [events[1], events[0]];
  const snapshot = [...input];

  const result = filterFreeEvents(input);

  assert.deepEqual(input, snapshot);
  assert.notEqual(result, input);
});
