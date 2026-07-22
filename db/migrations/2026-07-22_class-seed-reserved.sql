-- ============================================================
-- Per-group "seed" reserved seats + capacity bump to 15.
-- Run in the Supabase SQL editor. Idempotent: safe to re-run.
--
-- seed_reserved lets an admin reflect real offline/WhatsApp reservations
-- that aren't tracked as class_bookings rows. It is treated as REAL
-- occupied seats: it's added to booked_count for the public "X/15" display
-- AND counted toward the capacity check in book_class(), so "seats left"
-- always matches what can actually be booked (no overselling, no phantom
-- seats the page shows full while the RPC still lets people in).
-- ============================================================

-- ── BLOCK 1 ── new column + capacity = 15 for every group ────
alter table public.class_groups
  add column if not exists seed_reserved int not null default 0;

update public.class_groups set capacity = 15;

-- ── BLOCK 2 ── booking RPC counts seed_reserved toward capacity ──
create or replace function public.book_class(p_group_id text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_uid   uuid := auth.uid();
  v_cap   int;
  v_count int;
  v_seed  int;
begin
  if v_uid is null then return 'auth'; end if;
  if exists (select 1 from class_bookings where user_id = v_uid and status = 'reserved') then
    return 'already';
  end if;
  -- Lock the group row so concurrent bookings can't oversell the seats.
  select capacity, booked_count, seed_reserved into v_cap, v_count, v_seed
    from class_groups where id = p_group_id and is_active for update;
  if not found then return 'notfound'; end if;
  -- seed_reserved are real (offline) seats — they count against capacity.
  if v_count + coalesce(v_seed, 0) >= v_cap then return 'full'; end if;
  insert into class_bookings(group_id, user_id) values (p_group_id, v_uid);
  return 'ok';
end $$;

grant execute on function public.book_class(text) to authenticated;
