-- ============================================================
-- Weekly pacing for live-class cohorts.
-- start_date anchors the cohort's rhythm: the dashboard shows "Semaine N",
-- highlights this week's lessons/devoirs (2 lessons/week) and dims future
-- ones — soft pacing, nothing is locked. NULL = no pacing (current behavior).
-- Set per group from the admin console (📅 input) or here in SQL.
-- Run in the Supabase SQL editor. Idempotent.
-- ============================================================

alter table public.class_groups
  add column if not exists start_date date;
