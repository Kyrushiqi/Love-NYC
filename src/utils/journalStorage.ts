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

/**
 * Save a new journal entry (private by default)
 */
export function saveJournalEntry(headline: string): UserStory {
  const entry: UserStory = {
    id: `user-${Date.now()}`,
    type: 'user',
    headline: headline.trim(),
    createdAt: new Date().toISOString(),
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
export async function shareToContext(journalId: string): Promise<boolean> {
  const entries = getLocalJournalEntries();
  const entry = entries.find((e) => e.id === journalId);

  if (!entry) return false;

  const filtered = filterUserContent(entry.headline);
  if (!filtered.isClean) {
    console.warn('Entry failed content filter, not sharing:', filtered.reasons);
    return false;
  }

  entry.isSharedToCommunity = true;
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
      console.warn('Community share failed:', data.error || response.statusText);
      return false;
    }

    const savedEntry = await response.json();
    return Boolean(savedEntry?.id);
  } catch (err) {
    console.warn('Error posting community entry:', err);
    return false;
  }
}

/**
 * Get all visible community entries from the server with a local fallback.
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
  try {
    const response = await fetch(COMMUNITY_API_URL);
    if (response.ok) {
      const entries = (await response.json()) as CommunityEntry[];
      const visible = entries.filter((entry) => entry.isVisible);
      if (visible.length === 0) return null;

      const today = new Date().toDateString();
      const seed = today
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const index = seed % visible.length;
      return visible[index];
    }
  } catch (err) {
    console.warn('Falling back to local community entries:', err);
  }

  const entries = getLocalCommunityEntries().filter((entry) => entry.isVisible);
  if (entries.length === 0) return null;

  const today = new Date().toDateString();
  const seed = today
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % entries.length;
  return entries[index];
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
