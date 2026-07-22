-- ============================================================
-- Reservation requests for live classes.
-- Run in the Supabase SQL editor. Idempotent: safe to re-run.
--
-- A visitor fills a short form (name + WhatsApp + email) to request a seat.
-- The row lands here as 'pending'. When the admin confirms it, a Supabase
-- account is created (shared starter password, forced change on first login),
-- a reserved booking is made, and one month of access is granted. Confirm is
-- done through /api/admin/classes/resolve-request with the service role, so no
-- public/authenticated policy is needed here — RLS just locks the table down.
-- ============================================================

create table if not exists public.class_reservation_requests (
  id                uuid        primary key default gen_random_uuid(),
  full_name         text        not null,
  whatsapp          text        not null,
  email             text        not null,
  group_id          text        references public.class_groups(id) on delete set null,
  status            text        not null default 'pending'
                      check (status in ('pending','confirmed','rejected')),
  created_at        timestamptz not null default now(),
  resolved_at       timestamptz,
  confirmed_user_id uuid        references auth.users(id) on delete set null
);

create index if not exists reservation_requests_status
  on public.class_reservation_requests(status, created_at);

-- Lock the table: only the service role (used by the request + admin APIs)
-- and admins touch it. No anon/authenticated policies → RLS denies them.
alter table public.class_reservation_requests enable row level security;

drop policy if exists "reservation_requests admin read" on public.class_reservation_requests;
create policy "reservation_requests admin read" on public.class_reservation_requests
  for select using (public.is_admin());
