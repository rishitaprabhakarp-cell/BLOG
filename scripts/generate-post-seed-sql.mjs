/**
 * Regenerate supabase/seeds/001_bangalore_traffic_post.sql from markdown source.
 * Run: node scripts/generate-post-seed-sql.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const tag = "post_body";
const open = `$${tag}$`;

const body = readFileSync(
  join(root, "content/posts/bangalore-traffic-demand-prediction.md"),
  "utf8",
);

if (body.includes(open)) {
  throw new Error(`Markdown body contains delimiter ${open}`);
}

const sql = `-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

insert into public.posts (
  slug, title, subtitle, description, body,
  published_at, published, featured, category, tags
) values (
  'bangalore-traffic-demand-prediction',
  'Bangalore Traffic Demand Prediction',
  'Project Whitepaper — Plain-Language Edition',
  'How we reached a 91.38 public score predicting city-grid traffic demand with temporal features, CatBoost, XGBoost, and an honest validation strategy built for hidden test data.',
  ${open}${body}${open},
  '2026-05-31', true, true, 'research',
  array['machine-learning', 'traffic', 'catboost', 'xgboost', 'ensemble', 'feature-engineering']
)
on conflict (slug) do update set
  title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, body = excluded.body,
  published_at = excluded.published_at, published = excluded.published,
  featured = excluded.featured, category = excluded.category,
  tags = excluded.tags, updated_at = now();
`;

const out = join(root, "supabase/seeds/001_bangalore_traffic_post.sql");
writeFileSync(out, sql);
console.log(`Wrote ${out} (${(sql.length / 1024).toFixed(1)} KB)`);
