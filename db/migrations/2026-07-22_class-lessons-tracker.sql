-- ============================================================
-- Per-group lesson progress tracker.
-- Run in the Supabase SQL editor. Idempotent: safe to re-run.
--
-- lessons_done is a manual counter the teacher advances by 1 each time the
-- live group finishes a lesson, capped at the level's total lesson count in
-- the app UI. It's independent of each student's own self-paced progress.
-- ============================================================

alter table public.class_groups
  add column if not exists lessons_done int not null default 0;
