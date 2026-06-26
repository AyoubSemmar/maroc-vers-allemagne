-- ============================================================
-- Graded online course — Phase 2: teacher assignments + AI grading
--   assignments            : teacher-authored exercises (4 skills)
--   assignment_submissions : one graded attempt per student
-- Run each BLOCK in the Supabase SQL editor. Depends on is_admin()
-- from 2026-06-26_course_grades.sql. Idempotent: safe to re-run.
-- ============================================================

-- ── BLOCK 1 ── assignments ───────────────────────────────────
create table if not exists public.assignments (
  id            uuid        primary key default gen_random_uuid(),
  skill         text        not null check (skill in ('grammar','lesen','schreiben','hoeren')),
  level_id      text        not null,                 -- 'A1'..'C1'
  group_id      text        references public.class_groups(id) on delete set null, -- null = whole level
  title         text        not null,
  -- Student-facing instruction (German task text for schreiben; intro otherwise).
  instructions  text,
  -- Student-facing exercise body. For grammar/lesen/hoeren:
  --   { "text": "<reading/listening passage, omitted for grammar>",
  --     "questions": [ { "q": "...", "options": ["..x4"] } ] }
  -- For schreiben: { "minWords": int, "maxWords": int }
  content       jsonb,
  -- Grading key, NEVER sent to students (served only via admin / service role):
  --   { "correct": [int], "explanations": ["..."] }  for MCQ skills
  answer_key    jsonb,
  max_points    int         not null default 100,
  due_at        timestamptz,
  is_published  boolean     not null default false,
  created_by    uuid        references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists assignments_level_pub
  on public.assignments(level_id, is_published);

alter table public.assignments enable row level security;

-- Students may read only PUBLISHED assignments and never the answer_key
-- column. PostgREST honours column GRANTs, so we revoke answer_key from
-- the anon/authenticated roles and the students' SELECT can't return it.
drop policy if exists "assignments read published" on public.assignments;
drop policy if exists "assignments admin write"    on public.assignments;

create policy "assignments read published" on public.assignments
  for select using (is_published or public.is_admin());

create policy "assignments admin write" on public.assignments
  for all using (public.is_admin()) with check (public.is_admin());

-- Column security: hide the answer key from non-admins. A table-level SELECT
-- (which Supabase grants by default) covers every column, so a per-column
-- REVOKE is a no-op — we must revoke the whole-table SELECT and re-grant
-- every column EXCEPT answer_key. Admin access uses the service-role key,
-- which bypasses column grants, so the gradebook/grading routes still see it.
revoke select on public.assignments from anon, authenticated;
grant select (
  id, skill, level_id, group_id, title, instructions, content,
  max_points, due_at, is_published, created_by, created_at
) on public.assignments to anon, authenticated;

-- ── BLOCK 2 ── assignment_submissions ────────────────────────
create table if not exists public.assignment_submissions (
  id             uuid        primary key default gen_random_uuid(),
  assignment_id  uuid        not null references public.assignments(id) on delete cascade,
  user_id        uuid        not null references auth.users(id) on delete cascade,
  -- MCQ skills: { "choices": [int] }.  schreiben: { "text": "..." }
  answers        jsonb,
  auto_score     int,        -- objective MCQ score (grammar/lesen/hoeren)
  ai_score       int,        -- Claude score (schreiben)
  ai_feedback    jsonb,      -- { corrected, mistakes[], tip } for schreiben
  teacher_score  int,        -- optional override; wins when present
  status         text        not null default 'graded' check (status in ('submitted','graded')),
  submitted_at   timestamptz not null default now(),
  graded_at      timestamptz,
  unique (assignment_id, user_id)
);

create index if not exists submissions_assignment
  on public.assignment_submissions(assignment_id);

alter table public.assignment_submissions enable row level security;

drop policy if exists "submissions self read"  on public.assignment_submissions;
drop policy if exists "submissions admin read" on public.assignment_submissions;
drop policy if exists "submissions admin write" on public.assignment_submissions;

-- Students read their own; admins read all (gradebook).
create policy "submissions self read" on public.assignment_submissions
  for select using (auth.uid() = user_id or public.is_admin());

-- Inserts/updates happen through the service-role grading route, but allow
-- admins to override a grade directly too.
create policy "submissions admin write" on public.assignment_submissions
  for all using (public.is_admin()) with check (public.is_admin());
