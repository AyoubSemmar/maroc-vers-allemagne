-- ============================================================
-- Paid-access gate for live classes.
-- A reservation no longer grants course access on its own: the student
-- reserves a seat, gets payment instructions on WhatsApp, and the admin
-- flips access_granted = true once they've paid. Only then do they see
-- the "Mon cours" entry + reach the dashboard / video call.
-- Run in the Supabase SQL editor. Idempotent.
-- ============================================================

alter table public.class_bookings
  add column if not exists access_granted boolean not null default false;

-- Students already read their own booking row (existing "self read" policy),
-- so they can read access_granted too — no new policy needed. The admin
-- flips it via the service-role /api/admin/classes/grant route.
