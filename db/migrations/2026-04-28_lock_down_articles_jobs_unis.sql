-- Lock down the three content tables so the public anon key can ONLY
-- read, never write. Writes are then funnelled through the admin panel
-- (server actions in app/[locale]/admin/actions.js using service_role).
--
-- Why this is urgent: with RLS disabled, any visitor holding the public
-- NEXT_PUBLIC_SUPABASE_ANON_KEY (i.e. anyone who has loaded the site)
-- can hit the Supabase REST API directly with PATCH/POST/DELETE and
-- modify your articles, ausbildung_jobs, or — once RLS-write policies
-- are added — universities rows. RLS off = public write access.
--
-- Safe to re-run (every statement is idempotent: enable-if-not-already,
-- create-if-not-exists, drop-if-exists).
--
-- Run once in the Supabase SQL editor.

-- ── articles ───────────────────────────────────────────────────────
alter table public.articles enable row level security;

-- Defensive: drop any pre-existing permissive policies that might
-- have been added through the dashboard.
drop policy if exists "articles_public_read"   on public.articles;
drop policy if exists "articles_public_write"  on public.articles;
drop policy if exists "articles_anon_all"      on public.articles;

-- Anyone can read articles (public site).
create policy "articles_public_read"
  on public.articles
  for select
  using (true);

-- Notice: NO insert/update/delete policy = denied for anon by default.
-- service_role (the admin actions) bypasses RLS entirely so the admin
-- panel keeps working.

-- ── ausbildung_jobs ────────────────────────────────────────────────
alter table public.ausbildung_jobs enable row level security;

drop policy if exists "ausbildung_jobs_public_read"  on public.ausbildung_jobs;
drop policy if exists "ausbildung_jobs_public_write" on public.ausbildung_jobs;
drop policy if exists "ausbildung_jobs_anon_all"     on public.ausbildung_jobs;

create policy "ausbildung_jobs_public_read"
  on public.ausbildung_jobs
  for select
  using (true);

-- ── universities ──────────────────────────────────────────────────
-- RLS already enabled by 0001_universities.sql with a SELECT policy.
-- This block is purely defensive: if anyone added a write policy
-- through the dashboard, drop it. The admin panel uses service_role
-- and bypasses RLS, so no write policy is needed.
drop policy if exists "universities_public_write" on public.universities;
drop policy if exists "universities_anon_all"     on public.universities;

-- Same for university_programs.
drop policy if exists "programs_public_write" on public.university_programs;
drop policy if exists "programs_anon_all"     on public.university_programs;
