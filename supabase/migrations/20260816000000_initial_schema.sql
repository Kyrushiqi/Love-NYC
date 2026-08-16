-- ==============================================================================
-- LOVE NYC - Initial Database Schema Migration
-- Migration: 20260816000000_initial_schema.sql
-- Description: Creates tables, RLS policies, RPC functions, triggers, and indexes
-- ==============================================================================

-- 1. Helper function for automated updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------------------------
-- 2. TABLE: community_moments
-- Stores user-submitted positive moments shared across New York City
-- ------------------------------------------------------------------------------
create table if not exists public.community_moments (
  id text primary key,
  headline text not null check (char_length(headline) > 0 and char_length(headline) <= 280),
  borough text not null default 'MANHATTAN',
  submitted_at timestamptz not null default now(),
  is_visible boolean not null default true,
  likes_count integer not null default 1 check (likes_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to maintain updated_at
drop trigger if exists set_community_moments_updated_at on public.community_moments;
create trigger set_community_moments_updated_at
  before update on public.community_moments
  for each row
  execute function public.handle_updated_at();

-- Indexes for fast feed ordering and filtering
create index if not exists idx_community_moments_visible_submitted
  on public.community_moments (is_visible, submitted_at desc);

create index if not exists idx_community_moments_borough
  on public.community_moments (borough);

-- ------------------------------------------------------------------------------
-- 3. TABLE: stories_cache
-- Caches daily AI-generated stories and fact snapshots
-- ------------------------------------------------------------------------------
create table if not exists public.stories_cache (
  id text primary key,
  category text not null check (category in ('fix', 'gather', 'create', 'care', 'custom')),
  date_str text not null,
  line1 text not null,
  line2 text not null,
  detail text not null,
  is_ai_generated boolean not null default false,
  generated_at timestamptz not null default now(),
  borough text,
  fact jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_stories_cache_category_date
  on public.stories_cache (category, date_str);

-- ------------------------------------------------------------------------------
-- 4. TABLE: journal_entries
-- Stores private or shareable personal journaling moments
-- ------------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  headline text not null check (char_length(headline) > 0 and char_length(headline) <= 280),
  borough text default 'MANHATTAN',
  is_shared_to_community boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_journal_entries_user_created
  on public.journal_entries (user_id, created_at desc);

-- ------------------------------------------------------------------------------
-- 5. TABLE: custom_datasets
-- Stores user-registered NYC Open Data dataset endpoints and configurations
-- ------------------------------------------------------------------------------
create table if not exists public.custom_datasets (
  id uuid primary key default gen_random_uuid(),
  dataset_id text not null,
  dataset_name text not null,
  dataset_url text,
  endpoint text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 6. RPC: increment_community_likes
-- Safely and atomically increments likes for a community moment
-- ------------------------------------------------------------------------------
create or replace function public.increment_community_likes(entry_id text)
returns integer
language plpgsql
security definer
as $$
declare
  new_count integer;
begin
  update public.community_moments
  set likes_count = likes_count + 1,
      updated_at = now()
  where id = entry_id
  returning likes_count into new_count;

  return coalesce(new_count, 0);
end;
$$;

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.community_moments enable row level security;
alter table public.stories_cache enable row level security;
alter table public.journal_entries enable row level security;
alter table public.custom_datasets enable row level security;

-- community_moments policies
drop policy if exists "Public can read visible community moments" on public.community_moments;
create policy "Public can read visible community moments"
  on public.community_moments
  for select
  using (is_visible = true);

drop policy if exists "Public can insert community moments" on public.community_moments;
create policy "Public can insert community moments"
  on public.community_moments
  for insert
  with check (is_visible = true and char_length(headline) <= 280);

drop policy if exists "Service role has full access to community moments" on public.community_moments;
create policy "Service role has full access to community moments"
  on public.community_moments
  for all
  using (auth.role() = 'service_role');

-- stories_cache policies
drop policy if exists "Public can read stories cache" on public.stories_cache;
create policy "Public can read stories cache"
  on public.stories_cache
  for select
  using (true);

drop policy if exists "Public can insert stories cache" on public.stories_cache;
create policy "Public can insert stories cache"
  on public.stories_cache
  for insert
  with check (true);

drop policy if exists "Service role has full access to stories cache" on public.stories_cache;
create policy "Service role has full access to stories cache"
  on public.stories_cache
  for all
  using (auth.role() = 'service_role');

-- journal_entries policies
drop policy if exists "Public can read own or anonymous journal entries" on public.journal_entries;
create policy "Public can read own or anonymous journal entries"
  on public.journal_entries
  for select
  using (auth.uid() = user_id or user_id is null);

drop policy if exists "Public can insert journal entries" on public.journal_entries;
create policy "Public can insert journal entries"
  on public.journal_entries
  for insert
  with check (true);

-- custom_datasets policies
drop policy if exists "Public can read custom datasets" on public.custom_datasets;
create policy "Public can read custom datasets"
  on public.custom_datasets
  for select
  using (true);

drop policy if exists "Public can insert custom datasets" on public.custom_datasets;
create policy "Public can insert custom datasets"
  on public.custom_datasets
  for insert
  with check (true);
