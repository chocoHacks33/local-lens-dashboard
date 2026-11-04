import test from "node:test";
import assert from "node:assert/strict";

import { buildVenueDirectionsUrl } from "../src/features/venue-directions.js";

test("directions links encode the complete venue as a map destination", () => {
  const url = new URL(buildVenueDirectionsUrl("Arts House & Annex"));

  assert.equal(url.origin, "https://www.google.com");
  assert.equal(url.pathname, "/maps/dir/");
  assert.equal(url.searchParams.get("api"), "1");
  assert.equal(url.searchParams.get("destination"), "Arts House & Annex");
});

test("directions links are omitted when a venue is blank", () => {
  assert.equal(buildVenueDirectionsUrl("   "), null);
  assert.equal(buildVenueDirectionsUrl(null), null);
});
