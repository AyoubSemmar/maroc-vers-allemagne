-- Per-user daily rate-limit table for /api/enhance-photo
-- Run this in Supabase → SQL Editor

create table if not exists public.photo_enhance_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day     date not null default (now() at time zone 'utc')::date,
  count   integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

alter table public.photo_enhance_usage enable row level security;

-- Users can read their own usage (for the UI "remaining today")
drop policy if exists "own usage read" on public.photo_enhance_usage;
create policy "own usage read"
  on public.photo_enhance_usage
  for select
  using (auth.uid() = user_id);

-- Only the service role writes (from the API route). No client INSERT/UPDATE policy
-- is defined, so anon/authed clients cannot tamper with their own count.

create index if not exists photo_enhance_usage_day_idx
  on public.photo_enhance_usage (day);
