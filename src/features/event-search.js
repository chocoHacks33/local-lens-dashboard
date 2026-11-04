export function searchEvents(events, query) {
  const terms = String(query ?? "")
    .trim()
    .toLocaleLowerCase("en-SG")
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return [...events];
  }

  return events.filter((event) => {
    const searchableText = [event.title, event.category, event.venue, event.description]
      .join(" ")
      .toLocaleLowerCase("en-SG");

    return terms.every((term) => searchableText.includes(term));
  });
}
