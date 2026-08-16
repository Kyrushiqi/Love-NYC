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

function extractDatasetId(reference: string): string | null {
  const clean = reference.trim();
  if (!clean) return null;

  const directMatch = clean.match(/^[a-z0-9]{4}-[a-z0-9]{4}$/i);
  if (directMatch) return directMatch[0].toLowerCase();

  const resourceMatch = clean.match(
    /(?:resource|d)\/(?:[a-z0-9-]+\/)?([a-z0-9]{4}-[a-z0-9]{4})(?:\.|\/|$)/i,
  );
  if (resourceMatch) return resourceMatch[1].toLowerCase();

  const urlMatch = clean.match(
    /(?:data\.cityofnewyork\.us.*?\/)([a-z0-9]{4}-[a-z0-9]{4})(?:\/|\.|$)/i,
  );
  if (urlMatch) return urlMatch[1].toLowerCase();

  return null;
}

export function parseDatasetReference(raw: string): DatasetReferenceInfo {
  const cleaned = (raw ?? "").trim();
  if (!cleaned) {
    throw new Error(
      "Please provide a NYC Open Data dataset ID or full dataset URL.",
    );
  }

  const datasetId = extractDatasetId(cleaned);
  if (!datasetId) {
    throw new Error(
      "Could not find a valid Socrata dataset ID. Try a value like erm2-nwe9 or a NYC Open Data dataset URL.",
    );
  }

  const isApiViewQueryUrl =
    /^https?:\/\/data\.cityofnewyork\.us\/api\/v3\/views\/[a-z0-9]{4}-[a-z0-9]{4}\/query\.json/i.test(
      cleaned,
    );
  const canonicalDatasetUrl = `https://data.cityofnewyork.us/d/${datasetId}`;

  const datasetUrl =
    cleaned.startsWith("http") && !isApiViewQueryUrl
      ? cleaned.replace(/\/+$/, "")
      : canonicalDatasetUrl;

  const endpoint = isApiViewQueryUrl
    ? cleaned.replace(/\/+$/, "")
    : `https://data.cityofnewyork.us/resource/${datasetId}.json`;

  const fallbackEndpoints = isApiViewQueryUrl
    ? [`https://data.cityofnewyork.us/resource/${datasetId}.json`]
    : [`https://data.cityofnewyork.us/api/v3/views/${datasetId}/query.json`];

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
