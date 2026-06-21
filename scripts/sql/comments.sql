-- ============================================================
-- Article comments + reactions (likes/dislikes), with RLS.
-- Run this in the Supabase SQL editor (one time).
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- comments ----------
create table if not exists public.article_comments (
  id           uuid primary key default gen_random_uuid(),
  article_id   bigint not null references public.articles(id) on delete cascade,
  user_id      uuid   not null references auth.users(id)      on delete cascade,
  parent_id    uuid   references public.article_comments(id)  on delete cascade,
  body         text   not null check (char_length(body) between 1 and 4000),
  author_name  text,
  like_count   int    not null default 0,
  dislike_count int   not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists article_comments_article_idx on public.article_comments(article_id);
create index if not exists article_comments_parent_idx  on public.article_comments(parent_id);

-- ---------- reactions (one per user per comment) ----------
create table if not exists public.comment_reactions (
  comment_id uuid not null references public.article_comments(id) on delete cascade,
  user_id    uuid not null references auth.users(id)             on delete cascade,
  type       smallint not null check (type in (1, -1)),  -- 1 = like, -1 = dislike
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);
create index if not exists comment_reactions_comment_idx on public.comment_reactions(comment_id);

-- ---------- keep like/dislike counts in sync ----------
create or replace function public.recount_comment(c_id uuid)
returns void language sql as $$
  update public.article_comments ac set
    like_count    = (select count(*) from public.comment_reactions r where r.comment_id = c_id and r.type = 1),
    dislike_count = (select count(*) from public.comment_reactions r where r.comment_id = c_id and r.type = -1)
  where ac.id = c_id;
$$;

create or replace function public.on_reaction_change()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'DELETE') then
    perform public.recount_comment(old.comment_id);
    return old;
  else
    perform public.recount_comment(new.comment_id);
    return new;
  end if;
end;
$$;

drop trigger if exists trg_reaction_change on public.comment_reactions;
create trigger trg_reaction_change
  after insert or update or delete on public.comment_reactions
  for each row execute function public.on_reaction_change();

-- ---------- RLS ----------
alter table public.article_comments enable row level security;
alter table public.comment_reactions enable row level security;

-- comments: anyone can read; authenticated users manage only their own
drop policy if exists "comments read"   on public.article_comments;
drop policy if exists "comments insert" on public.article_comments;
drop policy if exists "comments update" on public.article_comments;
drop policy if exists "comments delete" on public.article_comments;
create policy "comments read"   on public.article_comments for select using (true);
create policy "comments insert" on public.article_comments for insert with check (auth.uid() = user_id);
create policy "comments update" on public.article_comments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "comments delete" on public.article_comments for delete using (auth.uid() = user_id);

-- reactions: anyone can read counts source; users manage only their own reaction
drop policy if exists "reactions read"   on public.comment_reactions;
drop policy if exists "reactions insert" on public.comment_reactions;
drop policy if exists "reactions update" on public.comment_reactions;
drop policy if exists "reactions delete" on public.comment_reactions;
create policy "reactions read"   on public.comment_reactions for select using (true);
create policy "reactions insert" on public.comment_reactions for insert with check (auth.uid() = user_id);
create policy "reactions update" on public.comment_reactions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reactions delete" on public.comment_reactions for delete using (auth.uid() = user_id);
