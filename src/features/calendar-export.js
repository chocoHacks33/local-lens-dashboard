const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

export function escapeCalendarText(value) {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll(/\r?\n/g, "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

export function formatCalendarTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    throw new TypeError("Calendar timestamps must be valid dates");
  }

  return date.toISOString().replaceAll(/[-:]/g, "").replace(".000", "");
}

export function createCalendarFile(event, generatedAt = new Date()) {
  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(startsAt.valueOf() + TWO_HOURS_IN_MS);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Local Lens//Event Dashboard//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${escapeCalendarText(event.id)}@local-lens-dashboard`,
    `DTSTAMP:${formatCalendarTimestamp(generatedAt)}`,
    `DTSTART:${formatCalendarTimestamp(startsAt)}`,
    `DTEND:${formatCalendarTimestamp(endsAt)}`,
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `LOCATION:${escapeCalendarText(event.venue)}`,
    `DESCRIPTION:${escapeCalendarText(event.description)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  return `${lines.join("\r\n")}\r\n`;
}

export function getCalendarFilename(event) {
  return `${event.id}.ics`;
}
