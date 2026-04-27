-- Saved opportunities: a user can bookmark a university or an
-- ausbildung_jobs row. The listing in /dashboard/saved reads this table
-- and joins back to the underlying item tables.

create table if not exists user_saves (
  user_id    uuid not null references auth.users(id) on delete cascade,
  item_type  text not null check (item_type in ('university', 'ausbildung_job')),
  item_id    text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_type, item_id)
);

create index if not exists user_saves_user_idx on user_saves (user_id, created_at desc);

-- RLS: users can only see / insert / delete their own saves.
alter table user_saves enable row level security;

drop policy if exists "user_saves_select_own" on user_saves;
create policy "user_saves_select_own"
  on user_saves for select
  using (auth.uid() = user_id);

drop policy if exists "user_saves_insert_own" on user_saves;
create policy "user_saves_insert_own"
  on user_saves for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_saves_delete_own" on user_saves;
create policy "user_saves_delete_own"
  on user_saves for delete
  using (auth.uid() = user_id);
