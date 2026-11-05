export function buildSharePayload(event, locationHref) {
  const pageUrl = new URL(locationHref);
  pageUrl.hash = `event-${encodeURIComponent(event.id)}`;

  return {
    title: event.title,
    text: `Discover ${event.title} at ${event.venue} on Local Lens.`,
    url: pageUrl.toString()
  };
}

export async function shareEvent(event, options = {}) {
  const payload = buildSharePayload(event, options.locationHref);

  if (options.share) {
    try {
      await options.share(payload);
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  if (options.writeText) {
    try {
      await options.writeText(payload.url);
      return "copied";
    } catch {
      return "unavailable";
    }
  }

  return "unavailable";
}
