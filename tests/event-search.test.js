import test from "node:test";
import assert from "node:assert/strict";

import { events } from "../src/data.js";
import { searchEvents } from "../src/features/event-search.js";

test("search matches event details case-insensitively", () => {
  assert.deepEqual(searchEvents(events, "MUSIC").map((event) => event.id), ["botanic-jazz-evening"]);
  assert.deepEqual(searchEvents(events, "bukit timah").map((event) => event.id), ["rail-corridor-cleanup"]);
});

test("every search term must match the same event", () => {
  assert.deepEqual(searchEvents(events, "browser interactive").map((event) => event.id), ["creative-coding-lab"]);
  assert.deepEqual(searchEvents(events, "jazz workshop"), []);
});

test("blank searches return a new array containing every event", () => {
  const result = searchEvents(events, "   ");

  assert.deepEqual(result, events);
  assert.notEqual(result, events);
});
