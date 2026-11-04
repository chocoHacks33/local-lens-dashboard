export function filterFreeEvents(events) {
  return events.filter((event) => Number(event.price) === 0);
}
