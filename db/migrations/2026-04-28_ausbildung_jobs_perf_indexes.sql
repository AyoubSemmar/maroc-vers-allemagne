-- Speeds up the listing query used by /ausbildung-jobs and
-- /dashboard/browse:
--
--   SELECT … FROM ausbildung_jobs
--    WHERE contact_email IS NOT NULL OR apply_url IS NOT NULL
--    ORDER BY enriched_at DESC NULLS LAST,
--             published_at DESC NULLS LAST
--    LIMIT 1000 OFFSET …
--
-- 0002 already created an ASC index on enriched_at, which Postgres can
-- scan in reverse but not while honouring NULLS LAST efficiently. The
-- two indexes below match the query's exact ordering and let the
-- planner do an index scan instead of a full sort on every ISR refresh.
--
-- Run once in the Supabase SQL editor.

create index if not exists ausb_enriched_desc_idx
  on ausbildung_jobs (enriched_at desc nulls last);

create index if not exists ausb_published_desc_idx
  on ausbildung_jobs (published_at desc nulls last);
