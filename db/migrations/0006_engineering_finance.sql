-- Extends the ausbildung_jobs.category CHECK constraint to allow two more
-- sectors covered by goausbildung: engineering, finance.
-- (handwerk was already permitted; we just broadened its label/keywords
-- in lib/jobCategories.ts to cover Bauwesen too — no DB change needed.)

alter table ausbildung_jobs
  drop constraint if exists ausbildung_jobs_category_check;

alter table ausbildung_jobs
  add constraint ausbildung_jobs_category_check
  check (category in (
    'hospitality',
    'handwerk',
    'it',
    'healthcare',
    'logistics',
    'education',
    'media',
    'public_service',
    'retail',
    'automotive',
    'engineering',
    'finance'
  ));
