import test from "node:test";
import assert from "node:assert/strict";

import { daysUntilEvent, formatEventCountdown } from "../src/features/event-countdown.js";

test("countdown compares Singapore calendar dates rather than elapsed hours", () => {
  const justAfterMidnightInSingapore = "2026-11-07T16:30:00Z";

  assert.equal(daysUntilEvent("2026-11-08T10:00:00+08:00", justAfterMidnightInSingapore), 0);
  assert.equal(formatEventCountdown("2026-11-08T10:00:00+08:00", justAfterMidnightInSingapore), "Today");
});

test("countdown uses concise labels for upcoming and past events", () => {
  const reference = "2026-11-04T12:00:00+08:00";

  assert.equal(formatEventCountdown("2026-11-05T09:00:00+08:00", reference), "Tomorrow");
  assert.equal(formatEventCountdown("2026-11-08T09:00:00+08:00", reference), "In 4 days");
  assert.equal(formatEventCountdown("2026-11-03T09:00:00+08:00", reference), "Event passed");
});

test("invalid dates produce a safe fallback", () => {
  assert.equal(daysUntilEvent("not-a-date"), null);
  assert.equal(formatEventCountdown("not-a-date"), "Date unavailable");
});
