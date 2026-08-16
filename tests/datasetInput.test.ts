import test from "node:test";
import assert from "node:assert/strict";

import { parseDatasetReference, extractDatasetId } from "../src/utils/datasetInput";

test("parseDatasetReference accepts a raw Socrata dataset id", () => {
  const parsed = parseDatasetReference("erm2-nwe9");

  assert.equal(parsed.datasetId, "erm2-nwe9");
  assert.match(parsed.datasetUrl, /erm2-nwe9/);
  assert.match(parsed.endpoint, /erm2-nwe9\.json/);
  assert.equal(parsed.isCustom, true);
});

test("parseDatasetReference accepts uppercase IDs and quotes", () => {
  const parsed = parseDatasetReference(' "ERM2-NWE9" ');

  assert.equal(parsed.datasetId, "erm2-nwe9");
  assert.match(parsed.datasetUrl, /erm2-nwe9/);
  assert.match(parsed.endpoint, /erm2-nwe9\.json/);
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

test("parseDatasetReference accepts URLs with query parameters and subpaths", () => {
  const parsed1 = parseDatasetReference(
    "https://data.cityofnewyork.us/d/erm2-nwe9?tab=data&page=1",
  );
  assert.equal(parsed1.datasetId, "erm2-nwe9");
  assert.equal(parsed1.endpoint, "https://data.cityofnewyork.us/resource/erm2-nwe9.json");

  const parsed2 = parseDatasetReference(
    "https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh/data_preview#table",
  );
  assert.equal(parsed2.datasetId, "uvpi-gqnh");
  assert.equal(parsed2.endpoint, "https://data.cityofnewyork.us/resource/uvpi-gqnh.json");
});

test("parseDatasetReference accepts non-NYC Socrata domains", () => {
  const parsed = parseDatasetReference(
    "https://data.ny.gov/Transportation/MTA-Subway-Hourly-Ridership/wujg-7c2s",
  );
  assert.equal(parsed.datasetId, "wujg-7c2s");
  assert.equal(parsed.endpoint, "https://data.ny.gov/resource/wujg-7c2s.json");
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
  assert.equal(parsed.isCustom, true);
});
