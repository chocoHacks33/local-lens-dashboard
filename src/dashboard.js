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

export function formatMoney(amount) {
  return currencyFormatter.format(amount);
}

export function formatEventDate(startsAt) {
  return dateFormatter.format(new Date(startsAt));
}

export function formatEventDuration(startsAt, endsAt) {
  const durationMinutes = Math.round((new Date(endsAt) - new Date(startsAt)) / 60000);
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return "Duration unavailable";
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const parts = [];
  if (hours) parts.push(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
  if (minutes) parts.push(`${minutes} min`);
  return parts.join(" ");
}

