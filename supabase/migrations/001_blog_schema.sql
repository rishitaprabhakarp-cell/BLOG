-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text not null default '',
  body text not null default '',
  published_at date not null default current_date,
  updated_at date,
  published boolean not null default false,
  featured boolean not null default false,
  tags text[] not null default '{}',
  category text not null default 'engineering',
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  body text not null default '',
  published_at date not null default current_date,
  published boolean not null default false,
  tags text[] not null default '{}',
  related_slugs text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  body text not null default '',
  published_at date not null default current_date,
  published boolean not null default false,
  featured boolean not null default false,
  tags text[] not null default '{}',
  tech text[] not null default '{}',
  github_url text,
  live_url text,
  timeline text,
  learnings text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.reading_list (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  status text not null check (status in ('reading', 'queued', 'completed')),
  note text,
  href text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists posts_published_at_idx on public.posts (published_at desc);
create index if not exists posts_published_idx on public.posts (published) where published = true;
create index if not exists notes_published_at_idx on public.notes (published_at desc);
create index if not exists projects_published_at_idx on public.projects (published_at desc);

alter table public.posts enable row level security;
alter table public.notes enable row level security;
alter table public.projects enable row level security;
alter table public.reading_list enable row level security;

create policy "Public read published posts"
  on public.posts for select
  using (published = true);

create policy "Public read published notes"
  on public.notes for select
  using (published = true);

create policy "Public read published projects"
  on public.projects for select
  using (published = true);

create policy "Public read reading list"
  on public.reading_list for select
  using (true);
