-- ============================================================
-- Live A1 group classes — booking + classroom access
-- Run each BLOCK in the Supabase SQL editor (Project → SQL editor).
-- Idempotent: safe to re-run.
-- ============================================================

-- ── BLOCK 1 ── class_groups: the fixed cohorts (public read) ──
create table if not exists public.class_groups (
  id            text        primary key,
  label         text        not null,
  schedule      text        not null,
  level         text        not null default 'a1',
  price_mad     int         not null default 200,
  capacity      int         not null default 10,
  room_slug     text        not null,
  booked_count  int         not null default 0,
  sort_order    int         not null default 0,
  is_active     boolean     not null default true
);

alter table public.class_groups enable row level security;
drop policy if exists "class_groups public read" on public.class_groups;
create policy "class_groups public read" on public.class_groups
  for select using (true);

insert into public.class_groups (id, label, schedule, room_slug, sort_order) values
  ('a1-1600',    'A1 — 16h-17h',          'Lun-Ven 16:00-17:00', 'GoGermanyA1-1600', 1),
  ('a1-1700',    'A1 — 17h-18h',          'Lun-Ven 17:00-18:00', 'GoGermanyA1-1700', 2),
  ('a1-1800',    'A1 — 18h-19h',          'Lun-Ven 18:00-19:00', 'GoGermanyA1-1800', 3),
  ('a1-1900',    'A1 — 19h-20h',          'Lun-Ven 19:00-20:00', 'GoGermanyA1-1900', 4),
  ('a1-weekend', 'A1 Intensif — Week-end', 'Sam-Dim 16:00-19:00', 'GoGermanyA1-WE',   5)
on conflict (id) do nothing;

-- ── BLOCK 2 ── class_bookings: one reserved seat per student ──
create table if not exists public.class_bookings (
  id          uuid        primary key default gen_random_uuid(),
  group_id    text        not null references public.class_groups(id) on delete cascade,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  status      text        not null default 'reserved' check (status in ('reserved','cancelled')),
  created_at  timestamptz not null default now()
);

-- A student may hold at most ONE reserved seat across all groups.
create unique index if not exists class_bookings_one_reserved_per_user
  on public.class_bookings(user_id) where status = 'reserved';

alter table public.class_bookings enable row level security;

drop policy if exists "class_bookings self read" on public.class_bookings;
create policy "class_bookings self read" on public.class_bookings
  for select using (auth.uid() = user_id);

-- ── BLOCK 3 ── keep class_groups.booked_count in sync ────────
create or replace function public.sync_class_booked_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' and new.status = 'reserved' then
    update public.class_groups set booked_count = booked_count + 1 where id = new.group_id;
  elsif tg_op = 'DELETE' and old.status = 'reserved' then
    update public.class_groups set booked_count = greatest(0, booked_count - 1) where id = old.group_id;
  elsif tg_op = 'UPDATE' then
    if old.status = 'reserved' and new.status <> 'reserved' then
      update public.class_groups set booked_count = greatest(0, booked_count - 1) where id = new.group_id;
    elsif old.status <> 'reserved' and new.status = 'reserved' then
      update public.class_groups set booked_count = booked_count + 1 where id = new.group_id;
    end if;
  end if;
  return null;
end $$;

drop trigger if exists trg_class_booked_count on public.class_bookings;
create trigger trg_class_booked_count
  after insert or update or delete on public.class_bookings
  for each row execute function public.sync_class_booked_count();

-- ── BLOCK 4 ── booking RPC: atomic, capacity-safe ───────────
-- Returns: 'ok' | 'auth' | 'already' | 'full' | 'notfound'
create or replace function public.book_class(p_group_id text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_uid   uuid := auth.uid();
  v_cap   int;
  v_count int;
begin
  if v_uid is null then return 'auth'; end if;
  if exists (select 1 from class_bookings where user_id = v_uid and status = 'reserved') then
    return 'already';
  end if;
  -- Lock the group row so concurrent bookings can't oversell the 10 seats.
  select capacity, booked_count into v_cap, v_count
    from class_groups where id = p_group_id and is_active for update;
  if not found then return 'notfound'; end if;
  if v_count >= v_cap then return 'full'; end if;
  insert into class_bookings(group_id, user_id) values (p_group_id, v_uid);
  return 'ok';
end $$;

grant execute on function public.book_class(text) to authenticated;

-- ── BLOCK 5 ── let a student cancel their own seat ──────────
create or replace function public.cancel_my_class()
returns void language plpgsql security definer set search_path = public as $$
begin
  update class_bookings set status = 'cancelled'
    where user_id = auth.uid() and status = 'reserved';
end $$;

grant execute on function public.cancel_my_class() to authenticated;
