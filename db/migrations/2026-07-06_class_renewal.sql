-- ============================================================
-- Monthly renewal for live-class access.
-- Access used to be a permanent boolean (class_bookings.access_granted):
-- once flipped true it never expired, so the 300 DH/month course was billed
-- by hand and effectively un-enforced after the first payment.
--
-- This adds an expiry DATE. Access is active while access_until >= today.
-- The admin "grant/renew" action extends it by one month; a lapsed date
-- locks the student out automatically (they land on a renewal screen) until
-- the admin extends it again.
--
-- Run in the Supabase SQL editor. Idempotent.
-- ============================================================

alter table public.class_bookings
  add column if not exists access_until date;

-- Backfill: everyone currently granted keeps access for one month from today,
-- so nobody is locked out the moment this ships. After that they renew normally.
update public.class_bookings
   set access_until = current_date + interval '1 month'
 where access_granted = true
   and access_until is null;

-- Notes:
--  * access_granted is kept as a legacy column but is no longer read by the app.
--  * Students already have a "self read" policy on class_bookings, so they can
--    read access_until with no new policy. Admin writes via the service role
--    through /api/admin/classes/grant.
