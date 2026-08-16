export interface DatasetReferenceInfo {
  datasetId: string;
  datasetUrl: string;
  endpoint: string;
  fallbackEndpoints?: string[];
  rawReference: string;
  isCustom: boolean;
}

export interface InferredDatasetFields {
  boroughField?: string;
  dateField?: string;
  locationField?: string;
  subjectField?: string;
  agencyField?: string;
  sampleKeys: string[];
}

export function extractDatasetId(reference: string): string | null {
  if (!reference) return null;
  const clean = reference.trim().replace(/^["'<(\[]+|["'>)\]]+$/g, "");
  if (!clean) return null;

  // 1. Direct 4x4 ID match (e.g. "erm2-nwe9" or "ERM2-NWE9")
  if (/^[a-z0-9]{4}-[a-z0-9]{4}$/i.test(clean)) {
    return clean.toLowerCase();
  }

  // 2. Specific Socrata URL path prefixes (e.g. /d/erm2-nwe9, /resource/erm2-nwe9.json, /views/erm2-nwe9)
  const resourceMatch = clean.match(
    /(?:resource|d|views|api\/views|datasets?|catalog)\/(?:[^\/?#]+\/)*([a-z0-9]{4}-[a-z0-9]{4})(?:\.|\/|\?|#|$)/i,
  );
  if (resourceMatch) return resourceMatch[1].toLowerCase();

  // 3. Inspect URL/path segments from right to left (handles nested URLs like .../erm2-nwe9/data_preview)
  const pathWithoutQuery = clean.split(/[?#]/)[0];
  const segments = pathWithoutQuery.split("/").filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i].replace(/\.[a-z0-9]+$/i, ""); // strip extensions like .json, .csv
    if (/^[a-z0-9]{4}-[a-z0-9]{4}$/i.test(seg)) {
      return seg.toLowerCase();
    }
  }

  // 4. Preceded by / or = (e.g. dataset=erm2-nwe9 or /erm2-nwe9)
  const slashOrEqualsMatch = clean.match(/[\/=]([a-z0-9]{4}-[a-z0-9]{4})(?:[.\/?#]|$)/i);
  if (slashOrEqualsMatch) {
    return slashOrEqualsMatch[1].toLowerCase();
  }

  // 5. Fallback: match 4x4 pattern in the string
  const generalMatch = clean.match(/\b([a-z0-9]{4}-[a-z0-9]{4})\b/i);
  if (generalMatch) {
    return generalMatch[1].toLowerCase();
  }

  return null;
}

export function parseDatasetReference(raw: string): DatasetReferenceInfo {
  const cleaned = (raw ?? "").trim().replace(/^["'<(\[]+|["'>)\]]+$/g, "");
  if (!cleaned) {
    throw new Error(
      "Please provide a NYC Open Data dataset ID (e.g. erm2-nwe9) or full dataset URL.",
    );
  }

  const datasetId = extractDatasetId(cleaned);
  if (!datasetId) {
    throw new Error(
      "Could not find a valid Socrata dataset ID. Try a value like erm2-nwe9 or a NYC Open Data dataset URL.",
    );
  }

  // Extract hostname if a full URL was provided
  let hostname = "data.cityofnewyork.us";
  try {
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      const parsedUrl = new URL(cleaned);
      if (parsedUrl.hostname) {
        hostname = parsedUrl.hostname;
      }
    } else if (cleaned.includes("data.") && cleaned.includes("/")) {
      const parsedUrl = new URL(`https://${cleaned}`);
      if (parsedUrl.hostname) {
        hostname = parsedUrl.hostname;
      }
    }
  } catch {
    // Keep default hostname
  }

  const isApiViewQueryUrl =
    /api\/v3\/views\/[a-z0-9]{4}-[a-z0-9]{4}\/query\.json/i.test(cleaned);

  const canonicalDatasetUrl = `https://${hostname}/d/${datasetId}`;

  const datasetUrl =
    cleaned.startsWith("http") && !isApiViewQueryUrl
      ? cleaned.replace(/[?#].*$/, "").replace(/\/+$/, "")
      : canonicalDatasetUrl;

  const endpoint = isApiViewQueryUrl
    ? cleaned.replace(/\/+$/, "")
    : `https://${hostname}/resource/${datasetId}.json`;

  const fallbackEndpoints = [
    `https://${hostname}/resource/${datasetId}.json`,
    `https://${hostname}/api/v3/views/${datasetId}/query.json`,
    `https://${hostname}/api/views/${datasetId}/rows.json`,
    `https://data.cityofnewyork.us/resource/${datasetId}.json`,
    `https://data.cityofnewyork.us/api/v3/views/${datasetId}/query.json`,
  ].filter((ep, idx, arr) => ep !== endpoint && arr.indexOf(ep) === idx);

  return {
    datasetId,
    datasetUrl,
    endpoint,
    fallbackEndpoints,
    rawReference: cleaned,
    isCustom: true,
  };
}

function matchFieldKey(keys: string[], patterns: string[]): string | undefined {
  const lowerPatterns = patterns.map((p) => p.toLowerCase());

  for (const key of keys) {
    const lower = key.toLowerCase();
    if (lowerPatterns.some((pattern) => lower.includes(pattern))) {
      return key;
    }
  }

  return undefined;
}

export function inferDatasetFields(
  rows: Record<string, unknown>[],
): InferredDatasetFields {
  const firstRow = rows.find((row) => row && typeof row === "object") as
    | Record<string, unknown>
    | undefined;
  const keys = firstRow ? Object.keys(firstRow) : [];

  return {
    boroughField: matchFieldKey(keys, [
      "borough",
      "city",
      "county",
      "neighborhood",
      "community_board",
    ]),
    dateField: matchFieldKey(keys, [
      "date",
      "created",
      "updated",
      "start_date",
      "startdatetime",
      "closed_date",
      "timestamp",
    ]),
    locationField: matchFieldKey(keys, [
      "location",
      "address",
      "incident_address",
      "event_location",
      "property",
      "site",
      "park",
    ]),
    subjectField: matchFieldKey(keys, [
      "subject",
      "complaint_type",
      "event_name",
      "title",
      "species",
      "type",
      "descriptor",
    ]),
    agencyField: matchFieldKey(keys, [
      "agency",
      "agency_name",
      "department",
      "office",
    ]),
    sampleKeys: keys.slice(0, 8),
  };
}
