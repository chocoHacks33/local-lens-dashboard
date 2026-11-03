export const SAVED_EVENTS_KEY = "local-lens.saved-events";

export function loadSavedEventIds(storage, validEventIds = []) {
  try {
    const savedIds = JSON.parse(storage.getItem(SAVED_EVENTS_KEY) ?? "[]");
    if (!Array.isArray(savedIds)) {
      return new Set();
    }

    const validIds = new Set(validEventIds);
    return new Set(savedIds.filter((id) => typeof id === "string" && validIds.has(id)));
  } catch {
    return new Set();
  }
}

export function saveSavedEventIds(storage, savedEventIds) {
  const ids = [...new Set(savedEventIds)].sort();
  storage.setItem(SAVED_EVENTS_KEY, JSON.stringify(ids));
}

export function toggleSavedEvent(savedEventIds, eventId) {
  const nextSavedIds = new Set(savedEventIds);
  if (nextSavedIds.has(eventId)) {
    nextSavedIds.delete(eventId);
  } else {
    nextSavedIds.add(eventId);
  }

  return nextSavedIds;
}
