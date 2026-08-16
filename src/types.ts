export type StoryCategory = 'fix' | 'gather' | 'create' | 'care' | 'grow';

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

/**
 * User-submitted personal journal entry
 * Private by default, can be shared to Community page
 */
export interface UserStory {
  id: string;
  type: 'user';
  headline: string; // One line from user (auto-cropped to ~140 chars)
  createdAt: string; // ISO timestamp
  borough?: string; // Optional borough mention
  isSharedToCommunity: boolean; // Whether user chose to share
}

/**
 * Community entry: anonymized user-submitted positive moment
 * Only shown if user opted into sharing
 */
export interface CommunityEntry {
  id: string;
  headline: string;
  borough?: string;
  submittedAt: string;
  isVisible: boolean; // Passes content filter
  likesCount?: number; // Upvotes/reactions from fellow New Yorkers
}
