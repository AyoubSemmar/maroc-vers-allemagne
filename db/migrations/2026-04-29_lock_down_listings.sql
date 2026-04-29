-- Lock down public.listings — same fix shape as the articles + jobs +
-- universities migration from 2026-04-28, applied to the missed table.
--
-- Without this, anyone holding the public NEXT_PUBLIC_SUPABASE_ANON_KEY
-- (i.e. anyone who has loaded the site) can hit the Supabase REST API
-- directly with PATCH/DELETE/POST and modify any housing listing —
-- including listings posted by other users. The DeleteListingButton on
-- /listings/[id] does this by design (anon-key DELETE), and a hostile
-- caller can use it without going through the UI.
--
-- After this migration:
--   • Anyone can SELECT listings (public site keeps working).
--   • Authenticated users can INSERT listings only with their own
--     user_id (RLS rejects attempts to spoof someone else's id).
--   • Authenticated users can UPDATE / DELETE only their own listings.
--   • service_role (the admin panel server actions) bypasses RLS, so
--     admin add / delete continues to work without code changes.
--
-- Safe to re-run (every statement is idempotent: enable-if-not-already,
-- drop-if-exists, create-if-not-exists semantics).
--
-- Run once in the Supabase SQL editor.

alter table public.listings enable row level security;

-- Defensive: drop any pre-existing permissive policies that may have
-- been added through the dashboard during testing.
drop policy if exists "listings_public_read"  on public.listings;
drop policy if exists "listings_insert_own"   on public.listings;
drop policy if exists "listings_update_own"   on public.listings;
drop policy if exists "listings_delete_own"   on public.listings;
drop policy if exists "listings_anon_all"     on public.listings;
drop policy if exists "listings_public_write" on public.listings;

-- Public read — the listings page on the marketing site.
create policy "listings_public_read"
  on public.listings
  for select
  using (true);

-- Owner-only writes. auth.uid() returns the authenticated caller's
-- user_id; if it doesn't match the row's user_id, the operation is
-- denied at the DB level regardless of what the client tries to send.
create policy "listings_insert_own"
  on public.listings
  for insert
  with check (auth.uid() = user_id);

create policy "listings_update_own"
  on public.listings
  for update
  using (auth.uid() = user_id);

create policy "listings_delete_own"
  on public.listings
  for delete
  using (auth.uid() = user_id);
