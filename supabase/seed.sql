-- ==============================================================================
-- LOVE NYC - Initial Seed Data
-- File: supabase/seed.sql
-- Description: Seeds authentic warm New Yorker community moments
-- ==============================================================================

insert into public.community_moments (id, headline, borough, submitted_at, is_visible, likes_count)
values
  (
    'community-seed-1',
    'A stranger held the heavy train door at Union Square and smiled like we were old friends.',
    'MANHATTAN',
    now() - interval '2 hours',
    true,
    26
  ),
  (
    'community-seed-2',
    'Someone set up free bouquets of fresh zinnias in mason jars on their Greenpoint stoop.',
    'BROOKLYN',
    now() - interval '5 hours',
    true,
    38
  ),
  (
    'community-seed-3',
    'An impromptu acoustic jazz duo played in Astoria Park right as the golden hour hit.',
    'QUEENS',
    now() - interval '8 hours',
    true,
    19
  ),
  (
    'community-seed-4',
    'A high school brass band was practicing in the park and everyone passing by cheered.',
    'BRONX',
    now() - interval '12 hours',
    true,
    42
  ),
  (
    'community-seed-5',
    'Watched the ferry dock at St. George while three kids waved happily from the upper deck.',
    'STATEN ISLAND',
    now() - interval '18 hours',
    true,
    15
  ),
  (
    'community-seed-6',
    'A neighbor shoveled the entire corner sidewalk so elderly residents could reach the bus stop safely.',
    'BROOKLYN',
    now() - interval '24 hours',
    true,
    56
  ),
  (
    'community-seed-7',
    'The baker at the corner bodega slipped an extra warm cinnamon pastry into my brown bag.',
    'MANHATTAN',
    now() - interval '30 hours',
    true,
    29
  )
on conflict (id) do update set
  headline = excluded.headline,
  borough = excluded.borough,
  likes_count = excluded.likes_count,
  is_visible = excluded.is_visible;
