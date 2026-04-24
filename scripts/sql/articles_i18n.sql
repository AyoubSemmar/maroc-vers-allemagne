-- Adds a per-locale translations column to the articles table.
-- Shape: { "fr": { "title": "...", "summary": "...", "content": "...", "faqs": [...] },
--          "en": { ... },
--          "de": { ... } }
-- Arabic remains in the existing top-level columns (source language).

alter table public.articles
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- Optional: same treatment for listings if/when needed.
alter table public.listings
  add column if not exists translations jsonb not null default '{}'::jsonb;
