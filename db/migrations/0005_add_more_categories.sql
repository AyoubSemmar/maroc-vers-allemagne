-- Extend the ausbildung_jobs.category CHECK constraint to allow three more
-- sectors covered by the goausbildung scraper: public_service, retail,
-- automotive.

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
    'automotive'
  ));
