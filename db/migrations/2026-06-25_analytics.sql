-- First-party website analytics — pageviews + search terms, stored in Supabase
-- (no cookies, no PII). Writes happen only via the service role in /api/track;
-- the table is RLS-locked so it can't be read or spammed from the client.
-- Run each BLOCK in the Supabase SQL editor.

-- ── BLOCK 1 ── events table ──────────────────────────────────
create table if not exists public.analytics_events (
  id         bigserial   primary key,
  type       text        not null check (type in ('pageview', 'search')),
  path       text,                 -- for pageviews (locale-stripped route)
  term       text,                 -- for searches (the query)
  locale     text,
  ref        text,                 -- referrer host
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_type_time on public.analytics_events (type, created_at desc);
create index if not exists analytics_events_time on public.analytics_events (created_at desc);

alter table public.analytics_events enable row level security;
-- No policies → anon/auth clients can't read or write. The /api/track route
-- and the admin both use the service role, which bypasses RLS.

-- ── BLOCK 2 ── aggregation helpers (called by the admin) ─────
create or replace function public.analytics_top_pages(p_days int default 30, p_limit int default 20)
returns table(path text, views bigint) language sql stable as $$
  select path, count(*) as views
  from public.analytics_events
  where type = 'pageview' and path is not null
    and created_at > now() - make_interval(days => p_days)
  group by path order by views desc limit p_limit;
$$;

create or replace function public.analytics_top_terms(p_days int default 30, p_limit int default 20)
returns table(term text, searches bigint) language sql stable as $$
  select lower(trim(term)) as term, count(*) as searches
  from public.analytics_events
  where type = 'search' and term is not null and length(trim(term)) > 0
    and created_at > now() - make_interval(days => p_days)
  group by lower(trim(term)) order by searches desc limit p_limit;
$$;

create or replace function public.analytics_daily(p_days int default 30)
returns table(day date, views bigint) language sql stable as $$
  select created_at::date as day, count(*) as views
  from public.analytics_events
  where type = 'pageview' and created_at > now() - make_interval(days => p_days)
  group by day order by day;
$$;

create or replace function public.analytics_top_dim(p_dim text, p_days int default 30, p_limit int default 12)
returns table(label text, views bigint) language plpgsql stable as $$
begin
  return query execute format(
    'select coalesce(%I, ''(none)'') as label, count(*) as views
       from public.analytics_events
      where type = ''pageview'' and created_at > now() - make_interval(days => %L)
      group by 1 order by 2 desc limit %L', p_dim, p_days, p_limit);
end;
$$;
