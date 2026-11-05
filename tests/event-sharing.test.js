import test from "node:test";
import assert from "node:assert/strict";

import { events } from "../src/data.js";
import { buildSharePayload, shareEvent } from "../src/features/event-sharing.js";

test("share payload points to the selected event card", () => {
  assert.deepEqual(buildSharePayload(events[0], "https://example.com/dashboard?city=sg#old"), {
    title: "Tiong Bahru Art Market",
    text: "Discover Tiong Bahru Art Market at Tiong Bahru Community Plaza on Local Lens.",
    url: "https://example.com/dashboard?city=sg#event-tiong-bahru-art-market"
  });
});

test("native sharing receives the complete event payload", async () => {
  let received;
  const result = await shareEvent(events[1], {
    locationHref: "https://example.com/",
    share: async (payload) => {
      received = payload;
    }
  });

  assert.equal(result, "shared");
  assert.equal(received.title, events[1].title);
  assert.match(received.url, /#event-botanic-jazz-evening$/);
});

test("clipboard fallback copies the deep link when native sharing fails", async () => {
  let copied;
  const result = await shareEvent(events[2], {
    locationHref: "https://example.com/",
    share: async () => {
      throw new Error("not supported");
    },
    writeText: async (value) => {
      copied = value;
    }
  });

  assert.equal(result, "copied");
  assert.equal(copied, "https://example.com/#event-rail-corridor-cleanup");
});

test("a cancelled native share does not copy unexpectedly", async () => {
  let copied = false;
  const result = await shareEvent(events[0], {
    locationHref: "https://example.com/",
    share: async () => {
      const error = new Error("cancelled");
      error.name = "AbortError";
      throw error;
    },
    writeText: async () => {
      copied = true;
    }
  });

  assert.equal(result, "cancelled");
  assert.equal(copied, false);
});

test("a blocked clipboard reports sharing as unavailable", async () => {
  const result = await shareEvent(events[0], {
    locationHref: "https://example.com/",
    writeText: async () => {
      throw new Error("permission denied");
    }
  });

  assert.equal(result, "unavailable");
});
