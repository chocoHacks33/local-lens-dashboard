import test from "node:test";
import assert from "node:assert/strict";

import { events } from "../src/data.js";
import {
  calculateTicketBudget,
  DEFAULT_TICKET_BUDGET,
  loadTicketBudget,
  parseTicketBudget,
  saveTicketBudget,
  TICKET_BUDGET_KEY
} from "../src/features/ticket-budget.js";

function createStorage(initialValue) {
  const values = new Map(initialValue === undefined ? [] : [[TICKET_BUDGET_KEY, initialValue]]);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    value: (key) => values.get(key)
  };
}

test("ticket budget summary reports remaining and over-budget amounts", () => {
  assert.deepEqual(calculateTicketBudget(events, 60), {
    budget: 60,
    ticketTotal: 53,
    difference: 7,
    percentage: 88,
    withinBudget: true
  });
  assert.equal(calculateTicketBudget(events, 40).difference, -13);
  assert.equal(calculateTicketBudget(events, 40).withinBudget, false);
});

test("invalid or negative budget inputs are safely normalized", () => {
  assert.equal(parseTicketBudget(-1), 0);
  assert.equal(parseTicketBudget("not-a-number"), 0);
  assert.equal(calculateTicketBudget(events, 0).percentage, 100);
});

test("budget storage uses a useful default and persists normalized values", () => {
  const emptyStorage = createStorage();
  const savedStorage = createStorage("75");

  assert.equal(loadTicketBudget(emptyStorage), DEFAULT_TICKET_BUDGET);
  assert.equal(loadTicketBudget(savedStorage), 75);
  saveTicketBudget(emptyStorage, -10);
  assert.equal(emptyStorage.value(TICKET_BUDGET_KEY), "0");
});
