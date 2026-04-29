-- Adds a gender_target column to public.listings.
--
-- Some flatshares / Frauen-WGs only accept tenants of one gender.
-- Renting houses in Germany routinely lists this preference, and
-- without surfacing it on a listing card a hopeful tenant can waste
-- time messaging a place that won't accept them.
--
-- Allowed values:
--   'male'   — men only
--   'female' — women only
--   'any'    — no preference / mixed (the default for new listings)
--   NULL     — legacy / unspecified (existing rows pre-migration)
--
-- Run once in the Supabase SQL editor.

alter table public.listings
  add column if not exists gender_target text;

-- Soft check constraint — keeps the column free-form for legacy rows
-- while rejecting bad new values from the API/admin paths.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'listings_gender_target_check'
  ) then
    alter table public.listings
      add constraint listings_gender_target_check
      check (gender_target is null or gender_target in ('male', 'female', 'any'));
  end if;
end $$;
