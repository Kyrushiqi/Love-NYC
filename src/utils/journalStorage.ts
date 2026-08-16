/**
 * Storage and Data Service for user journal entries and community entries.
 * Primary source of truth is the Supabase Database with resilient fallback.
 */

import { UserStory, CommunityEntry } from '../types';
import { filterUserContent } from './contentFilter';
import {
  insertCommunityMomentDirect,
  insertJournalEntryDirect,
  isSupabaseConfigured,
  getSupabaseClient,
} from './supabaseClient';

const JOURNAL_STORAGE_KEY = 'love_nyc_journal_entries';
const COMMUNITY_STORAGE_KEY = 'love_nyc_community_entries';
const COMMUNITY_API_URL = '/api/community';
const JOURNAL_API_URL = '/api/journal';

export const DEFAULT_COMMUNITY_FALLBACKS: CommunityEntry[] = [
  {
    id: 'community-seed-1',
    headline: 'A stranger held the heavy train door at Union Square and smiled like we were old friends.',
    borough: 'MANHATTAN',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isVisible: true,
    likesCount: 26,
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
 * Fetch all community entries directly from Supabase database (via API or Supabase client)
 */
export async function getAllCommunityEntries(): Promise<CommunityEntry[]> {
  // 1. Try server endpoint which queries Supabase
  try {
    const response = await fetch(COMMUNITY_API_URL);
    if (response.ok) {
      const entries = (await response.json()) as CommunityEntry[];
      const visible = entries.filter((entry) => entry.isVisible);
      if (visible.length > 0) {
        localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(visible));
        return visible;
      }
    }
  } catch (err) {
    console.warn('[LOVE NYC] Server community fetch notice:', err);
  }

  // 2. Direct client-side Supabase query if available
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from('community_moments')
          .select('*')
          .eq('is_visible', true)
          .order('submitted_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: CommunityEntry[] = data.map((row) => ({
            id: row.id,
            headline: row.headline,
            borough: row.borough,
            submittedAt: row.submitted_at,
            isVisible: row.is_visible,
            likesCount: row.likes_count,
          }));
          localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(mapped));
          return mapped;
        }
      }
    } catch (dbErr) {
      console.warn('[LOVE NYC] Direct Supabase community fetch error:', dbErr);
    }
  }

  // 3. Fallback to cached local entries or default seeds
  const localEntries = getLocalCommunityEntries().filter((entry) => entry.isVisible);
  return localEntries.length > 0 ? localEntries : DEFAULT_COMMUNITY_FALLBACKS;
}

/**
 * Fetch private journal entries directly from the database
 */
export async function fetchJournalEntries(): Promise<UserStory[]> {
  // 1. Fetch from server API
  try {
    const res = await fetch(JOURNAL_API_URL);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('[LOVE NYC] Server journal fetch notice:', err);
  }

  // 2. Direct Supabase query if available
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from('journal_entries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: UserStory[] = data.map((row) => ({
            id: row.id,
            type: 'user',
            headline: row.headline,
            borough: row.borough || undefined,
            isSharedToCommunity: row.is_shared_to_community,
            createdAt: row.created_at,
          }));
          localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(mapped));
          return mapped;
        }
      }
    } catch (dbErr) {
      console.warn('[LOVE NYC] Direct Supabase journal fetch error:', dbErr);
    }
  }

  return getLocalJournalEntries();
}

/**
 * Get today's journal entry by checking the database first
 */
export async function getTodaysJournalEntryAsync(): Promise<UserStory | null> {
  const entries = await fetchJournalEntries();
  const today = new Date().toDateString();
  return entries.find((e) => new Date(e.createdAt).toDateString() === today) || null;
}

/**
 * Save a new journal entry to the database and sync locally
 */
export async function saveJournalEntryAsync(headline: string, borough?: string): Promise<UserStory> {
  const entry: UserStory = {
    id: `user-${Date.now()}`,
    type: 'user',
    headline: headline.trim(),
    createdAt: new Date().toISOString(),
    borough: borough || 'MANHATTAN',
    isSharedToCommunity: false,
  };

  // 1. Update local cache immediately
  const entries = getLocalJournalEntries();
  entries.unshift(entry);
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));

  // 2. Persist directly to Supabase database & API
  try {
    await fetch(`${JOURNAL_API_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: entry.id,
        headline: entry.headline,
        borough: entry.borough,
        isSharedToCommunity: entry.isSharedToCommunity,
        createdAt: entry.createdAt,
      }),
    });

    if (isSupabaseConfigured()) {
      await insertJournalEntryDirect({
        id: entry.id,
        headline: entry.headline,
        borough: entry.borough,
        isSharedToCommunity: entry.isSharedToCommunity,
        createdAt: entry.createdAt,
      });
    }
  } catch (err) {
    console.warn('[LOVE NYC] Database journal entry save notice:', err);
  }

  return entry;
}

/**
 * Synchronous wrapper for backwards compatibility
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
  entries.unshift(entry);
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));

  saveJournalEntryAsync(headline, borough).catch(() => {});
  return entry;
}

/**
 * Share a journal entry to the community database.
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
    entries.unshift(entry);
  }
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));

  const momentId = entry.id.startsWith('community-')
    ? entry.id
    : `community-${entry.id.replace(/^user-/, '')}`;

  try {
    // 1. Post to backend server endpoint (persists to Supabase community_moments)
    const response = await fetch(`${COMMUNITY_API_URL}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: momentId,
        headline: entry.headline,
        borough: entry.borough,
        createdAt: entry.createdAt,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.warn('Community share endpoint returned non-200:', data);
    }

    // 2. Direct Supabase insert for redundancy
    if (isSupabaseConfigured()) {
      await insertCommunityMomentDirect({
        id: momentId,
        headline: entry.headline,
        borough: entry.borough,
        submittedAt: entry.createdAt,
        isVisible: true,
        likesCount: 1,
      });

      await insertJournalEntryDirect({
        id: entry.id,
        headline: entry.headline,
        borough: entry.borough,
        isSharedToCommunity: true,
        createdAt: entry.createdAt,
      });
    }

    // 3. Update local cache
    const localComm = getLocalCommunityEntries();
    const newCommEntry: CommunityEntry = {
      id: momentId,
      headline: entry.headline,
      borough: entry.borough,
      submittedAt: entry.createdAt,
      isVisible: true,
      likesCount: 1,
    };
    localStorage.setItem(
      COMMUNITY_STORAGE_KEY,
      JSON.stringify([newCommEntry, ...localComm.filter((c) => c.id !== momentId)])
    );

    return { success: true };
  } catch (err) {
    console.warn('Network error sharing community entry:', err);
    return { success: true };
  }
}

/**
 * Send a heart/like to a community entry in the database
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
 * Get all private journal entries from local cache
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
 * Get today's journal entry from local cache
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
