export const ALL_CATEGORIES = "all";

export function getEventCategories(events) {
  return [...new Set(events.map((event) => event.category))].sort((left, right) => left.localeCompare(right));
}

export function filterEventsByCategory(events, selectedCategory) {
  if (!selectedCategory || selectedCategory === ALL_CATEGORIES) {
    return [...events];
  }

  const normalizedSelection = selectedCategory.trim().toLocaleLowerCase();
  return events.filter((event) => event.category.toLocaleLowerCase() === normalizedSelection);
}
