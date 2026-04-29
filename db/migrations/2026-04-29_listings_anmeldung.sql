-- Adds an `with_anmeldung` boolean column to public.listings.
--
-- Anmeldung is mandatory residence registration in Germany — but many
-- short-term sublets and grey-market rooms don't allow tenants to
-- register their address there. For someone migrating from abroad it's
-- a make-or-break detail: without an Anmeldung-friendly address you
-- can't open a bank account, get a tax ID, finalize a visa, etc.
--
-- Nullable on purpose: pre-existing rows have unknown status and shouldn't
-- be force-defaulted to true/false. The UI shows a "ask the owner"
-- placeholder for null values; new listings posted via /listings/new
-- and the admin panel always set a value.
--
-- Run once in the Supabase SQL editor.

alter table public.listings
  add column if not exists with_anmeldung boolean;
