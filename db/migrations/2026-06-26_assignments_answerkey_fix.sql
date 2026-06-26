-- ============================================================
-- FIX: hide assignments.answer_key from students for real.
--
-- The previous `revoke select (answer_key)` was a no-op: Supabase grants
-- anon/authenticated a TABLE-LEVEL select, which already covers every
-- column. Column-level revokes don't shrink a table-level grant. The
-- correct recipe is: revoke the whole-table select, then grant select on
-- every column EXCEPT answer_key.
--
-- Run in the Supabase SQL editor. Idempotent.
-- ============================================================

revoke select on public.assignments from anon, authenticated;

grant select (
  id, skill, level_id, group_id, title, instructions, content,
  max_points, due_at, is_published, created_by, created_at
) on public.assignments to anon, authenticated;

-- Note: any NEW column added to assignments later will be invisible to
-- students until it is added to the grant above. answer_key stays excluded.
