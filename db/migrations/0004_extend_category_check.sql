-- Extend the ausbildung_jobs.category CHECK constraint to allow the new
-- 'media' and 'education' buckets. The original constraint only listed the
-- five Arbeitsagentur-era categories.

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
    'media'
  ));
