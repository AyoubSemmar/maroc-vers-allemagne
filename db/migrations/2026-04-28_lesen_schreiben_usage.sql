-- Daily-reading and daily-writing exercise usage tables. Same shape as
-- the other entitlement-ledger tables. Used purely for analytics in the
-- admin AI Ops dashboard — the actual rate-limit is still client-side
-- via localStorage (Haiku is cheap enough that a strict server gate
-- isn't worth the complexity).

create table if not exists public.reading_exercise_usage (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  day        date        not null,
  count      int         not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.writing_exercise_usage (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  day        date        not null,
  count      int         not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- RLS off — service-role only writes (from API routes).
alter table public.reading_exercise_usage enable row level security;
alter table public.writing_exercise_usage enable row level security;

-- Optional: let the user read their own row (handy if we ever surface a
-- "you've used X/Y today" UI).
create policy "read own reading usage"
  on public.reading_exercise_usage for select
  using (auth.uid() = user_id);

create policy "read own writing usage"
  on public.writing_exercise_usage for select
  using (auth.uid() = user_id);
