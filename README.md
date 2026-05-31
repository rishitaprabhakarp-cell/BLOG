# Research & Engineering Blog

Stripe.dev–inspired personal blog backed by **Supabase**. No mock content — all posts, notes, and projects come from your database.

## Stack

- Next.js 16 · TypeScript · Tailwind CSS v4
- Supabase (Postgres + RLS)
- react-markdown · Fuse.js command palette

## Setup

### 1. Install

```bash
cd portfolio
npm install
```

### 2. Environment

`.env.local` is already configured with your Supabase project. Set production URL when deploying:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. Create database tables

Open **Supabase Dashboard → SQL Editor** and run:

`supabase/migrations/001_blog_schema.sql`

This creates `posts`, `notes`, `projects`, and `reading_list` with public read RLS policies.

### 4. Add content

Insert rows via Supabase Table Editor or SQL. Example post:

```sql
insert into posts (slug, title, description, body, published, featured, tags, category)
values (
  'my-first-post',
  'My First Post',
  'A short summary for cards and SEO.',
  '## Hello\n\nYour markdown body here.',
  true,
  true,
  array['engineering'],
  'engineering'
);
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Design

Terminal-inspired UI matching stripe.dev patterns:

- Bracket navigation `[B] BLOG`, `[C] CONSOLE`
- Grid background with `/ SECTION` labels
- Lime hover rows on blog index
- Terminal-frame featured cards
- Metadata sidebar on articles
- Stats ticker footer

## Routes

| Path | Description |
|------|-------------|
| `/` | Home hub |
| `/blog` | Post index (stripe.dev list style) |
| `/blog/[slug]` | Article with `/ METADATA` sidebar |
| `/notes` | Research notes |
| `/projects` | Project writeups |
| `/about` | Portfolio / contact |

## Deploy (Vercel)

1. Push to GitHub
2. Import repo, set root to `portfolio`
3. Add env vars (`NEXT_PUBLIC_SUPABASE_*`, `NEXT_PUBLIC_SITE_URL`)
4. Deploy
