export const TICKET_BUDGET_KEY = "local-lens.ticket-budget";
export const DEFAULT_TICKET_BUDGET = 60;

export function parseTicketBudget(value) {
  const budget = Number(value);
  return Number.isFinite(budget) && budget >= 0 ? budget : 0;
}

export function loadTicketBudget(storage, fallback = DEFAULT_TICKET_BUDGET) {
  try {
    const storedValue = storage.getItem(TICKET_BUDGET_KEY);
    return storedValue === null ? fallback : parseTicketBudget(storedValue);
  } catch {
    return fallback;
  }
}

export function saveTicketBudget(storage, budget) {
  storage.setItem(TICKET_BUDGET_KEY, String(parseTicketBudget(budget)));
}

export function calculateTicketBudget(events, value) {
  const budget = parseTicketBudget(value);
  const ticketTotal = events.reduce((total, event) => total + Math.max(0, Number(event.price) || 0), 0);
  const difference = budget - ticketTotal;
  const percentage = budget === 0 ? (ticketTotal === 0 ? 0 : 100) : Math.min(100, Math.round((ticketTotal / budget) * 100));

  return {
    budget,
    ticketTotal,
    difference,
    percentage,
    withinBudget: difference >= 0
  };
}
