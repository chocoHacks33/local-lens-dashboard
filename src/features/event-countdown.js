const singaporeDateParts = new Intl.DateTimeFormat("en-SG", {
  timeZone: "Asia/Singapore",
  year: "numeric",
  month: "numeric",
  day: "numeric"
});

function toCalendarDay(value) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return null;
  }

  const parts = Object.fromEntries(
    singaporeDateParts
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );

  return Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000;
}

export function daysUntilEvent(startsAt, from = new Date()) {
  const eventDay = toCalendarDay(startsAt);
  const currentDay = toCalendarDay(from);

  if (eventDay === null || currentDay === null) {
    return null;
  }

  return eventDay - currentDay;
}

export function formatEventCountdown(startsAt, from = new Date()) {
  const days = daysUntilEvent(startsAt, from);

  if (days === null) return "Date unavailable";
  if (days < 0) return "Event passed";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}
