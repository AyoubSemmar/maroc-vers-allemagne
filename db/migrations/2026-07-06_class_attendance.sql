-- ============================================================
-- Live-class attendance log.
-- One row per student per day, written when they click "Rejoindre l'appel
-- vidéo" (via /api/classes/attend, service role). Powers the teacher's
-- attendance column in the console and doubles as an early churn signal:
-- a paying student who stops joining is about to not renew.
-- Run in the Supabase SQL editor. Idempotent.
-- ============================================================

create table if not exists public.class_attendance (
  id         uuid        primary key default gen_random_uuid(),
  group_id   text        not null references public.class_groups(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  day        date        not null default current_date,
  joined_at  timestamptz not null default now(),
  unique (user_id, day)
);

create index if not exists class_attendance_group_day
  on public.class_attendance (group_id, day desc);

alter table public.class_attendance enable row level security;

-- Students can see their own attendance; writes go through the service role
-- (the API route), so no insert policy for authenticated users.
drop policy if exists "class_attendance self read" on public.class_attendance;
create policy "class_attendance self read" on public.class_attendance
  for select using (auth.uid() = user_id);
