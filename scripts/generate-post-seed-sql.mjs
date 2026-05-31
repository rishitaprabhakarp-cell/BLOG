/**
 * Generate supabase/seeds/*.sql from content/posts/manifest.json
 * Run: node scripts/generate-post-seed-sql.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const seedsDir = join(root, "supabase/seeds");
const tag = "post_body";
const open = `$${tag}$`;

mkdirSync(seedsDir, { recursive: true });

const manifest = JSON.parse(
  readFileSync(join(root, "content/posts/manifest.json"), "utf8"),
);

for (let i = 0; i < manifest.length; i++) {
  const meta = manifest[i];
  const body = readFileSync(join(root, "content/posts", meta.markdown), "utf8");

  if (body.includes(open)) {
    throw new Error(`${meta.markdown} contains delimiter ${open}`);
  }

  const tagsSql = `array[${meta.tags.map((t) => `'${t.replace(/'/g, "''")}'`).join(", ")}]`;
  const descSql = meta.description.replace(/'/g, "''");
  const titleSql = meta.title.replace(/'/g, "''");
  const subtitleSql = meta.subtitle.replace(/'/g, "''");

  const sql = `-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

insert into public.posts (
  slug, title, subtitle, description, body,
  published_at, published, featured, category, tags
) values (
  '${meta.slug}',
  '${titleSql}',
  '${subtitleSql}',
  '${descSql}',
  ${open}${body}${open},
  '${meta.published_at}', ${meta.published}, ${meta.featured}, '${meta.category}',
  ${tagsSql}
)
on conflict (slug) do update set
  title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, body = excluded.body,
  published_at = excluded.published_at, published = excluded.published,
  featured = excluded.featured, category = excluded.category,
  tags = excluded.tags, updated_at = now();
`;

  const num = String(i + 1).padStart(3, "0");
  const out = join(seedsDir, `${num}_${meta.slug}.sql`);
  writeFileSync(out, sql);
  console.log(`Wrote ${out} (${(sql.length / 1024).toFixed(1)} KB)`);
}
