export function buildVenueDirectionsUrl(venue) {
  const query = String(venue ?? "").trim();
  if (!query) {
    return null;
  }

  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api", "1");
  url.searchParams.set("destination", query);
  return url.toString();
}
