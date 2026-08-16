export type StoryCategory = 'fix' | 'gather' | 'create' | 'care';

export type Borough = 'MANHATTAN' | 'BROOKLYN' | 'QUEENS' | 'BRONX' | 'STATEN ISLAND' | 'NYC';

export interface FactObject {
  id: string;
  category: StoryCategory;
  categoryLabel: string;
  emoji: string;
  datasetName: string;
  datasetId: string;
  datasetUrl: string;
  dateBadge: string;
  dateStr: string;
  isFreshToday: boolean;
  borough: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  subject: string;
  type: string;
  agency: string;
  raw: Record<string, unknown>;
}

export interface StoryItem {
  id: string;
  category: StoryCategory;
  fact: FactObject;
  line1: string;
  line2: string;
  detail: string;
  isAiGenerated: boolean;
  generatedAt: string;
}

export interface CitySummary {
  closed311Count: number;
  gatheringsCount: number;
  filmsCount: number;
  wildlifeRescuesCount: number;
  lastUpdated: string;
}

export interface DatasetStatus {
  category: StoryCategory;
  name: string;
  datasetId: string;
  status: 'live' | 'fallback' | 'loading';
  recordCount: number;
  endpoint: string;
  reliability: string;
}
