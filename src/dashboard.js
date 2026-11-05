const currencyFormatter = new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat("en-SG", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit"
});

export function sortEvents(items) {
  return [...items].sort((left, right) => new Date(left.startsAt) - new Date(right.startsAt));
}

export function summarizeEvents(items) {
  return {
    count: items.length,
    ticketTotal: items.reduce((sum, event) => sum + event.price, 0),
    categoryCount: new Set(items.map((event) => event.category)).size
  };
}

export function summarizeMonthlySpend(items) {
  const months = new Map();

  for (const event of items) {
    const date = new Date(event.startsAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const current = months.get(key) ?? {
      key,
      label: date.toLocaleDateString("en-SG", { month: "long", year: "numeric" }),
      total: 0,
      eventCount: 0
    };
    current.total += event.price;
    current.eventCount += 1;
    months.set(key, current);
  }

  return [...months.values()].sort((left, right) => left.key.localeCompare(right.key));
}

export function formatMoney(amount) {
  return currencyFormatter.format(amount);
}

export function formatEventDate(startsAt) {
  return dateFormatter.format(new Date(startsAt));
}

