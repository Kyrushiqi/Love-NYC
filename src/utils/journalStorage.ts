/**
 * Storage service for user journal entries and community entries.
 * Private journal entries stay local to the browser; shared community items are stored
 * on the server and persisted in a JSON file so all users can see the same feed.
 */

import { UserStory, CommunityEntry } from '../types';
import { filterUserContent } from './contentFilter';

const JOURNAL_STORAGE_KEY = 'love_nyc_journal_entries';
const COMMUNITY_STORAGE_KEY = 'love_nyc_community_entries';
const COMMUNITY_API_URL = '/api/community';

export const DEFAULT_COMMUNITY_FALLBACKS: CommunityEntry[] = [
  {
    id: 'community-seed-1',
    headline: 'A stranger held the heavy train door at Union Square and smiled like we were old friends.',
    borough: 'MANHATTAN',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isVisible: true,
    likesCount: 24,
  },
  {
    id: 'community-seed-2',
    headline: 'Someone set up free bouquets of fresh zinnias in mason jars on their Greenpoint stoop.',
    borough: 'BROOKLYN',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isVisible: true,
    likesCount: 38,
  },
  {
    id: 'community-seed-3',
    headline: 'An impromptu acoustic jazz duo played in Astoria Park right as the golden hour hit.',
    borough: 'QUEENS',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    isVisible: true,
    likesCount: 19,
  },
  {
    id: 'community-seed-4',
    headline: 'A high school brass band was practicing in the park and everyone passing by cheered.',
    borough: 'BRONX',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    isVisible: true,
    likesCount: 42,
  },
  {
    id: 'community-seed-5',
    headline: 'Watched the ferry dock at St. George while three kids waved happily from the upper deck.',
    borough: 'STATEN ISLAND',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    isVisible: true,
    likesCount: 15,
  },
  {
    id: 'community-seed-6',
    headline: 'A neighbor shoveled the entire corner sidewalk so elderly residents could reach the bus stop safely.',
    borough: 'BROOKLYN',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isVisible: true,
    likesCount: 56,
  },
  {
    id: 'community-seed-7',
    headline: 'The baker at the corner bodega slipped an extra warm cinnamon pastry into my brown bag.',
    borough: 'MANHATTAN',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    isVisible: true,
    likesCount: 29,
  },
];

/**
 * Save a new journal entry (private by default)
 */
export function saveJournalEntry(headline: string, borough?: string): UserStory {
  const entry: UserStory = {
    id: `user-${Date.now()}`,
    type: 'user',
    headline: headline.trim(),
    createdAt: new Date().toISOString(),
    borough: borough || 'MANHATTAN',
    isSharedToCommunity: false,
  };

  const entries = getLocalJournalEntries();
  entries.push(entry);
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));

  return entry;
}

/**
 * Get all private journal entries for the current user
 */
export function getLocalJournalEntries(): UserStory[] {
  try {
    const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.warn('Error reading journal entries:', err);
    return [];
  }
}

/**
 * Share a journal entry to the community page.
 * The entry is validated client-side and then persisted on the server.
 */
export async function shareToContext(
  journalIdOrEntry: string | UserStory
): Promise<{ success: boolean; error?: string }> {
  let entry: UserStory | undefined;
  const entries = getLocalJournalEntries();

  if (typeof journalIdOrEntry === 'string') {
    entry = entries.find((e) => e.id === journalIdOrEntry);
  } else {
    entry = journalIdOrEntry;
  }

  if (!entry || !entry.headline) {
    return { success: false, error: 'Entry content not found.' };
  }

  const filtered = filterUserContent(entry.headline);
  if (!filtered.isClean) {
    return {
      success: false,
      error: `Entry flagged: ${filtered.reasons.join(', ')}`,
    };
  }

  entry.isSharedToCommunity = true;
  const index = entries.findIndex((e) => e.id === entry!.id);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));

  try {
    const response = await fetch(`${COMMUNITY_API_URL}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headline: entry.headline,
        borough: entry.borough,
        createdAt: entry.createdAt,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.warn('Community share endpoint returned non-200:', data);
    }

    // Also update local community entries cache immediately
    const localComm = getLocalCommunityEntries();
    const newCommEntry: CommunityEntry = {
      id: entry.id,
      headline: entry.headline,
      borough: entry.borough,
      submittedAt: entry.createdAt,
      isVisible: true,
      likesCount: 1,
    };
    localStorage.setItem(
      COMMUNITY_STORAGE_KEY,
      JSON.stringify([newCommEntry, ...localComm])
    );

    return { success: true };
  } catch (err) {
    console.warn('Network error posting community entry, using local persistence:', err);
    // Graceful offline fallback
    const localComm = getLocalCommunityEntries();
    const newCommEntry: CommunityEntry = {
      id: entry.id,
      headline: entry.headline,
      borough: entry.borough,
      submittedAt: entry.createdAt,
      isVisible: true,
      likesCount: 1,
    };
    localStorage.setItem(
      COMMUNITY_STORAGE_KEY,
      JSON.stringify([newCommEntry, ...localComm])
    );
    return { success: true };
  }
}

/**
 * Send a heart/like to a community entry
 */
export async function likeCommunityEntry(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${COMMUNITY_API_URL}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    return response.ok;
  } catch (err) {
    console.warn('Error sending like to community entry:', err);
    return false;
  }
}

/**
 * Get all visible community entries from the server with a local fallback.
 */
export async function getAllCommunityEntries(): Promise<CommunityEntry[]> {
  try {
    const response = await fetch(COMMUNITY_API_URL);
    if (response.ok) {
      const entries = (await response.json()) as CommunityEntry[];
      const visible = entries.filter((entry) => entry.isVisible);
      if (visible.length > 0) {
        return visible;
      }
    }
  } catch (err) {
    console.warn('Falling back to local community entries:', err);
  }

  const localEntries = getLocalCommunityEntries().filter((entry) => entry.isVisible);
  return localEntries.length > 0 ? localEntries : DEFAULT_COMMUNITY_FALLBACKS;
}

/**
 * Get all local community entries stored in browser cache.
 */
export function getLocalCommunityEntries(): CommunityEntry[] {
  try {
    const stored = localStorage.getItem(COMMUNITY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.warn('Error reading community entries:', err);
    return [];
  }
}

/**
 * Get one featured community entry for today's view.
 */
export async function getDailyFeaturedCommunityEntry(): Promise<CommunityEntry | null> {
  const visible = await getAllCommunityEntries();
  if (visible.length === 0) return null;

  const today = new Date().toDateString();
  const seed = today
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % visible.length;
  return visible[index];
}

/**
 * Get today's journal entry (if user has written one)
 */
export function getTodaysJournalEntry(): UserStory | null {
  const entries = getLocalJournalEntries();
  const today = new Date().toDateString();

  return (
    entries.find((e) => new Date(e.createdAt).toDateString() === today) || null
  );
}

/**
 * Clear all data (for testing/reset)
 */
export function clearAllData(): void {
  localStorage.removeItem(JOURNAL_STORAGE_KEY);
  localStorage.removeItem(COMMUNITY_STORAGE_KEY);
}
