-- StudyBuddy sprint-tracker — per-task status table.
--
-- Internal team tool (5 known users) under /studybuddy. The task list
-- itself is static (lib/studybuddy/tasks.ts); only the live status of
-- each task lives here so the 5 team members can mutate it in real
-- time via Supabase Realtime.
--
-- RLS is "allow all" deliberately: this is a team-only URL with no PII;
-- the trade-off is simplicity vs. setting up a separate auth bucket
-- for this tiny tool. If the URL ever leaks, the worst outcome is
-- someone flipping a sprint task to "Erledigt" — recoverable.

create table if not exists public.studybuddy_task_status (
  task_id    text primary key,
  status     text not null default 'todo'
              check (status in ('todo','wip','help','done')),
  updated_by text,
  updated_at timestamptz not null default now()
);

alter table public.studybuddy_task_status enable row level security;

-- Drop-and-create so re-running the migration is idempotent.
drop policy if exists "studybuddy read"   on public.studybuddy_task_status;
drop policy if exists "studybuddy insert" on public.studybuddy_task_status;
drop policy if exists "studybuddy update" on public.studybuddy_task_status;

create policy "studybuddy read"   on public.studybuddy_task_status for select using (true);
create policy "studybuddy insert" on public.studybuddy_task_status for insert with check (true);
create policy "studybuddy update" on public.studybuddy_task_status for update using (true);

-- Subscribe the table to the realtime publication so postgres_changes
-- fires for the tracker UI.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'studybuddy_task_status'
  ) then
    execute 'alter publication supabase_realtime add table public.studybuddy_task_status';
  end if;
end$$;
