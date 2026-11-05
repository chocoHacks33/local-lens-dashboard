import test from "node:test";
import assert from "node:assert/strict";

import { events } from "../src/data.js";
import { formatMoney, sortEvents, sortEventsBy, summarizeEvents } from "../src/dashboard.js";

test("seed events have unique ids and valid capacity data", () => {
  assert.equal(new Set(events.map((event) => event.id)).size, events.length);

  for (const event of events) {
    assert.ok(event.title);
    assert.ok(event.category);
    assert.ok(!Number.isNaN(new Date(event.startsAt).valueOf()));
    assert.ok(event.price >= 0);
    assert.ok(event.attending >= 0 && event.attending <= event.capacity);
  }
});

test("dashboard summary totals the complete event list", () => {
  assert.deepEqual(summarizeEvents(events), {
    count: 6,
    ticketTotal: 53,
    categoryCount: 6
  });
});

test("events are sorted chronologically without mutating input", () => {
  const input = [events[2], events[0], events[1]];
  const sorted = sortEvents(input);

  assert.deepEqual(sorted.map((event) => event.id), [events[0].id, events[1].id, events[2].id]);
  assert.deepEqual(input.map((event) => event.id), [events[2].id, events[0].id, events[1].id]);
});

test("events can be sorted by price or title without mutating input", () => {
  const input = [events[1], events[0], events[3]];

  assert.deepEqual(sortEventsBy(input, "price").map((event) => event.id), [
    events[0].id,
    events[3].id,
    events[1].id
  ]);
  assert.deepEqual(sortEventsBy(input, "title").map((event) => event.title), [
    "Botanic Jazz Evening",
    "Startup Demo Night",
    "Tiong Bahru Art Market"
  ]);
  assert.deepEqual(input.map((event) => event.id), [events[1].id, events[0].id, events[3].id]);
});

test("an unknown sort option falls back to chronological order", () => {
  assert.deepEqual(sortEventsBy([events[2], events[0]], "unknown").map((event) => event.id), [
    events[0].id,
    events[2].id
  ]);
});

test("money formatting uses Singapore dollars", () => {
  assert.match(formatMoney(28), /\$28/);
});

