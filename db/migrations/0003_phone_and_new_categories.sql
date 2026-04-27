-- Adds a `phone` column to ausbildung_jobs for the goausbildung.com scraper
-- shape, which includes phone numbers in addition to email + apply URL.
-- Run this once in the Supabase SQL editor before
-- `node scripts/import_goausbildung.mjs <path>.json --category {media|education}`.
--
-- New category keys 'media' and 'education' are introduced at the application
-- layer (no constraint on `category` in the table), so no DDL needed there.

alter table ausbildung_jobs
  add column if not exists phone text;
