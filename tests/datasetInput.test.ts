import test from "node:test";
import assert from "node:assert/strict";

import { parseDatasetReference } from "../src/utils/datasetInput";

test("parseDatasetReference accepts a raw Socrata dataset id", () => {
  const parsed = parseDatasetReference("erm2-nwe9");

  assert.equal(parsed.datasetId, "erm2-nwe9");
  assert.match(parsed.datasetUrl, /erm2-nwe9/);
  assert.match(parsed.endpoint, /erm2-nwe9\.json/);
  assert.equal(parsed.isCustom, true);
});

test("parseDatasetReference accepts a full NYC Open Data URL", () => {
  const parsed = parseDatasetReference(
    "https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9",
  );

  assert.equal(parsed.datasetId, "erm2-nwe9");
  assert.equal(
    parsed.datasetUrl,
    "https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9",
  );
  assert.match(parsed.endpoint, /resource\/erm2-nwe9\.json$/);
  assert.equal(parsed.isCustom, true);
});

test("parseDatasetReference accepts a Socrata query API URL", () => {
  const parsed = parseDatasetReference(
    "https://data.cityofnewyork.us/api/v3/views/wwhr-5ven/query.json",
  );

  assert.equal(parsed.datasetId, "wwhr-5ven");
  assert.equal(parsed.datasetUrl, "https://data.cityofnewyork.us/d/wwhr-5ven");
  assert.equal(
    parsed.endpoint,
    "https://data.cityofnewyork.us/api/v3/views/wwhr-5ven/query.json",
  );
  assert.ok(Array.isArray(parsed.fallbackEndpoints));
  assert.equal(
    parsed.fallbackEndpoints?.[0],
    "https://data.cityofnewyork.us/resource/wwhr-5ven.json",
  );
  assert.equal(parsed.isCustom, true);
});
