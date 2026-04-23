-- ============================================================
-- Entitlements & admin plumbing — Phase 1
-- Paste each BLOCK separately into the Supabase SQL editor.
-- ============================================================

-- ── BLOCK 1 ── profiles: admin + premium flags ───────────────
alter table public.profiles
  add column if not exists is_admin      boolean     not null default false,
  add column if not exists is_premium    boolean     not null default false,
  add column if not exists premium_until timestamptz;

-- ── BLOCK 2 ── user_credits: pay-per-use balances ────────────
create table if not exists public.user_credits (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  photo_credits       int  not null default 0,
  cv_enhance_credits  int  not null default 0,
  motivation_credits  int  not null default 0,
  updated_at          timestamptz not null default now()
);

alter table public.user_credits enable row level security;

-- Users can read their own credits; writes only via service role (API routes).
drop policy if exists "user_credits self read" on public.user_credits;
create policy "user_credits self read" on public.user_credits
  for select using (auth.uid() = user_id);

-- ── BLOCK 3 ── user_unlocks: one-time unlocks (templates, German levels) ─
create table if not exists public.user_unlocks (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  kind       text        not null check (kind in ('template', 'german_level')),
  key        text        not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, key)
);

alter table public.user_unlocks enable row level security;
drop policy if exists "user_unlocks self read" on public.user_unlocks;
create policy "user_unlocks self read" on public.user_unlocks
  for select using (auth.uid() = user_id);

-- ── BLOCK 4 ── daily usage tables (one per paid feature) ─────
-- photo_enhance_usage already exists; the following three mirror its shape.
create table if not exists public.cv_enhance_usage (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  day        date        not null,
  count      int         not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.motivation_usage (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  day        date        not null,
  count      int         not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.ausbildung_reveals_usage (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  day        date        not null,
  count      int         not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

alter table public.cv_enhance_usage         enable row level security;
alter table public.motivation_usage         enable row level security;
alter table public.ausbildung_reveals_usage enable row level security;

drop policy if exists "cv_enhance_usage self read"         on public.cv_enhance_usage;
drop policy if exists "motivation_usage self read"         on public.motivation_usage;
drop policy if exists "ausbildung_reveals_usage self read" on public.ausbildung_reveals_usage;

create policy "cv_enhance_usage self read" on public.cv_enhance_usage
  for select using (auth.uid() = user_id);
create policy "motivation_usage self read" on public.motivation_usage
  for select using (auth.uid() = user_id);
create policy "ausbildung_reveals_usage self read" on public.ausbildung_reveals_usage
  for select using (auth.uid() = user_id);

-- ── BLOCK 5 ── make yourself admin ───────────────────────────
-- Replace the email below with YOUR account's email, then run this block.
update public.profiles
set is_admin = true
where user_id = (select id from auth.users where email = 'YOUR-EMAIL@example.com');
