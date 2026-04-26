-- Universities + programs schema for the German higher-education catalog.
-- Run this once in the Supabase SQL editor before running scripts/seed_universities.mjs.

-- pg_trgm enables substring search on names (Universität → "tum").
create extension if not exists pg_trgm;

-- ── Universities ────────────────────────────────────────────────
create table if not exists universities (
  id text primary key,                  -- slug, e.g. 'technische-universitaet-muenchen'
  wikidata_id text unique,              -- 'Q156478' (used to dedupe sync runs)
  name_de text not null,
  name_en text,
  name_ar text,
  name_fr text,
  city text,
  state text,                           -- Bundesland
  country_code char(2) default 'DE',
  -- universität | applied_sciences | art | music | dual | technical | medical | theological | pedagogical | other
  type text,
  is_public boolean default true,
  founded smallint,
  student_count int,
  website text,
  hochschulkompass_url text,
  logo_url text,
  lat double precision,
  lng double precision,
  description_de text,
  description_en text,
  description_ar text,
  description_fr text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists uni_city_idx        on universities (city);
create index if not exists uni_state_idx       on universities (state);
create index if not exists uni_type_idx        on universities (type);
create index if not exists uni_is_public_idx   on universities (is_public);
create index if not exists uni_name_de_trgm    on universities using gin (name_de gin_trgm_ops);
create index if not exists uni_name_en_trgm    on universities using gin (name_en gin_trgm_ops);

-- ── Programs (populated in Phase 2 by the Hochschulkompass scraper) ─
create table if not exists university_programs (
  id text primary key,                  -- '<uni>--<programslug>'
  university_id text references universities(id) on delete cascade,
  hochschulkompass_id text,
  title_de text not null,
  title_en text,
  title_ar text,
  title_fr text,
  level text check (level in ('bachelor','master','diplom','staatsexamen','phd','other')) not null,
  -- engineering | medicine | cs | business | social | science | arts | law | education | agriculture | other
  category text,
  language text,                        -- 'de' | 'en' | 'mixed' | 'other'
  duration_semesters smallint,
  ects int,
  faculty text,
  requirements_de text,
  requirements_en text,
  requirements_ar text,
  requirements_fr text,
  description_de text,
  description_en text,
  description_ar text,
  description_fr text,
  program_url text,                     -- official program page on uni's own site
  hochschulkompass_url text,
  application_deadline_winter text,     -- free-form, e.g. '15 July'
  application_deadline_summer text,
  has_tuition boolean,
  semester_fee_eur int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists prog_uni_idx       on university_programs (university_id);
create index if not exists prog_level_idx     on university_programs (level);
create index if not exists prog_category_idx  on university_programs (category);
create index if not exists prog_language_idx  on university_programs (language);
create index if not exists prog_title_trgm    on university_programs using gin (title_de gin_trgm_ops);

-- ── Public read access (RLS) ───────────────────────────────────
alter table universities enable row level security;
alter table university_programs enable row level security;

drop policy if exists "universities_public_read" on universities;
create policy "universities_public_read" on universities
  for select using (true);

drop policy if exists "programs_public_read" on university_programs;
create policy "programs_public_read" on university_programs
  for select using (true);
