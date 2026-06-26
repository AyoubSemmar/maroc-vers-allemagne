-- ============================================================
-- Graded online course — Phase 1 foundation
--   lesson_scores : bank the built-in lesson-exercise grades
--   vocab_progress: per-word mastery (Leitner box 0..5) for the
--                   "X / Y words learned" meter + grade pressure
-- Run each BLOCK in the Supabase SQL editor (Project -> SQL editor).
-- Idempotent: safe to re-run.
-- ============================================================

-- Helper: is the current auth user an admin? (owner / teacher view).
-- Used by the read-all policies so the gradebook can see every student.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and is_admin = true
  );
$$;

-- ── BLOCK 1 ── lesson_scores: best/last score per built-in lesson ──
create table if not exists public.lesson_scores (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  level_id    text        not null,          -- 'A1' | 'A2' | ...
  lesson_id   text        not null,
  best_score  int         not null default 0 check (best_score between 0 and 100),
  last_score  int         not null default 0 check (last_score between 0 and 100),
  attempts    int         not null default 0,
  updated_at  timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_scores enable row level security;

drop policy if exists "lesson_scores self rw"   on public.lesson_scores;
drop policy if exists "lesson_scores self ins"  on public.lesson_scores;
drop policy if exists "lesson_scores self upd"  on public.lesson_scores;
drop policy if exists "lesson_scores admin read" on public.lesson_scores;

create policy "lesson_scores self ins" on public.lesson_scores
  for insert with check (auth.uid() = user_id);
create policy "lesson_scores self upd" on public.lesson_scores
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "lesson_scores self rw" on public.lesson_scores
  for select using (auth.uid() = user_id or public.is_admin());

-- ── BLOCK 2 ── vocab_progress: per-word mastery ──────────────
create table if not exists public.vocab_progress (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  word_key    text        not null,          -- stable id, e.g. 'A1:der Tisch'
  level_id    text        not null,
  mastery     smallint    not null default 0 check (mastery between 0 and 5),
  seen        int         not null default 0,
  correct     int         not null default 0,
  next_due    timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, word_key)
);

create index if not exists vocab_progress_user_level
  on public.vocab_progress(user_id, level_id);

alter table public.vocab_progress enable row level security;

drop policy if exists "vocab_progress self ins"  on public.vocab_progress;
drop policy if exists "vocab_progress self upd"  on public.vocab_progress;
drop policy if exists "vocab_progress self read" on public.vocab_progress;

create policy "vocab_progress self ins" on public.vocab_progress
  for insert with check (auth.uid() = user_id);
create policy "vocab_progress self upd" on public.vocab_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "vocab_progress self read" on public.vocab_progress
  for select using (auth.uid() = user_id or public.is_admin());
