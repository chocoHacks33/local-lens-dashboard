import test from "node:test";
import assert from "node:assert/strict";

import { events } from "../src/data.js";
import {
  createCalendarFile,
  escapeCalendarText,
  formatCalendarTimestamp,
  getCalendarFilename
} from "../src/features/calendar-export.js";

test("calendar text escapes reserved characters and new lines", () => {
  assert.equal(escapeCalendarText("Meet, learn; share\nagain\\soon"), "Meet\\, learn\\; share\\nagain\\\\soon");
});

test("timestamp conversion emits UTC iCalendar values", () => {
  assert.equal(formatCalendarTimestamp("2026-11-12T19:30:00+08:00"), "20261112T113000Z");
  assert.throws(() => formatCalendarTimestamp("not-a-date"), /valid dates/);
});

test("event export contains a complete two-hour calendar entry", () => {
  const event = events[1];
  const file = createCalendarFile(event, "2026-11-03T00:00:00Z");

  assert.match(file, /^BEGIN:VCALENDAR\r\n/);
  assert.match(file, /DTSTAMP:20261103T000000Z/);
  assert.match(file, /DTSTART:20261112T113000Z/);
  assert.match(file, /DTEND:20261112T133000Z/);
  assert.match(file, /SUMMARY:Botanic Jazz Evening/);
  assert.match(file, /\r\nEND:VCALENDAR\r\n$/);
  assert.equal(getCalendarFilename(event), "botanic-jazz-evening.ics");
});
