import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

function getEnvVar(key: string): string {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  // Vite client-side environment check
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> })?.env;
    if (metaEnv && metaEnv[key]) {
      return metaEnv[key];
    }
  } catch {
    // Ignore in non-Vite execution
  }
  return '';
}

export function getSupabaseUrl(): string {
  return getEnvVar('SUPABASE_URL') || getEnvVar('VITE_SUPABASE_URL');
}

export function getSupabaseAnonKey(): string {
  return getEnvVar('SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY');
}

export function getSupabaseServiceRoleKey(): string {
  return getEnvVar('SUPABASE_SERVICE_ROLE_KEY');
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey() || getSupabaseServiceRoleKey();
  return Boolean(url && key);
}

let supabaseInstance: SupabaseClient<Database> | null = null;
let supabaseServerInstance: SupabaseClient<Database> | null = null;

/**
 * Returns public Supabase client (using anon key) for browser/client-side calls.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey() || getSupabaseServiceRoleKey();
    if (!url || !key) return null;
    supabaseInstance = createClient<Database>(url, key, {
      auth: {
        persistSession: typeof window !== 'undefined',
      },
    });
  }
  return supabaseInstance;
}

/**
 * Returns server-side Supabase client (using service role key if present, or anon key).
 */
export function getSupabaseServerClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseServerInstance) {
    const url = getSupabaseUrl();
    const key = getSupabaseServiceRoleKey() || getSupabaseAnonKey();
    if (!url || !key) return null;
    supabaseServerInstance = createClient<Database>(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseServerInstance;
}

export const supabase = getSupabaseClient();

/**
 * Client-side helper: Insert a new positive moment into Supabase community_moments
 */
export async function insertCommunityMomentDirect(moment: {
  id: string;
  headline: string;
  borough?: string;
  submittedAt?: string;
  isVisible?: boolean;
  likesCount?: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: 'Supabase client not configured.' };
    }

    const { error } = await client.from('community_moments').insert({
      id: moment.id,
      headline: moment.headline.trim(),
      borough: moment.borough || 'MANHATTAN',
      submitted_at: moment.submittedAt || new Date().toISOString(),
      is_visible: moment.isVisible !== false,
      likes_count: moment.likesCount || 1,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown database error',
    };
  }
}

/**
 * Client-side helper: Insert or sync a private journal entry to Supabase journal_entries
 */
export async function insertJournalEntryDirect(entry: {
  id: string;
  headline: string;
  borough?: string;
  isSharedToCommunity?: boolean;
  createdAt?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: 'Supabase client not configured.' };
    }

    const { error } = await client.from('journal_entries').upsert({
      id: entry.id,
      headline: entry.headline.trim(),
      borough: entry.borough || 'MANHATTAN',
      is_shared_to_community: Boolean(entry.isSharedToCommunity),
      created_at: entry.createdAt || new Date().toISOString(),
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown database error',
    };
  }
}
