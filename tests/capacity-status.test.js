import test from "node:test";
import assert from "node:assert/strict";

import { getCapacityStatus } from "../src/features/capacity-status.js";

test("available events expose remaining seats and occupancy", () => {
  assert.deepEqual(getCapacityStatus({ capacity: 80, attending: 52 }), {
    capacity: 80,
    attending: 52,
    remaining: 28,
    percentage: 65,
    level: "available",
    label: "Places available"
  });
});

test("nearly full events get a specific limited-capacity label", () => {
  const status = getCapacityStatus({ capacity: 36, attending: 31 });

  assert.equal(status.level, "limited");
  assert.equal(status.label, "5 seats left");
  assert.equal(status.percentage, 86);
});

test("attendance is clamped for sold-out and malformed event data", () => {
  assert.deepEqual(getCapacityStatus({ capacity: 10, attending: 12 }), {
    capacity: 10,
    attending: 10,
    remaining: 0,
    percentage: 100,
    level: "sold-out",
    label: "Sold out"
  });
  assert.equal(getCapacityStatus({ capacity: "unknown", attending: -3 }).percentage, 0);
});
