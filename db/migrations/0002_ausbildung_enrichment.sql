-- Adds an `enrichment_json` JSONB column to ausbildung_jobs.
-- Run this once in the Supabase SQL editor before
-- `node scripts/enrich_jobs.mjs --category healthcare`.

alter table ausbildung_jobs
  add column if not exists enrichment_json jsonb,
  add column if not exists enriched_at timestamptz;

create index if not exists ausb_enriched_idx on ausbildung_jobs (enriched_at);
