/**
 * Seed blog posts from content/posts/manifest.json into Supabase.
 *
 * Usage:
 *   node scripts/seed-post.mjs                    # seed all posts
 *   node scripts/seed-post.mjs cropguardian-...   # seed one slug
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const targetSlug = process.argv[2];

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  console.error("Alternatively run the matching file in supabase/seeds/ via SQL Editor.");
  process.exit(1);
}

const manifest = JSON.parse(
  readFileSync(join(root, "content/posts/manifest.json"), "utf8"),
);

const posts = targetSlug
  ? manifest.filter((p) => p.slug === targetSlug)
  : manifest;

if (posts.length === 0) {
  console.error(targetSlug ? `No post found for slug: ${targetSlug}` : "No posts in manifest");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

for (const meta of posts) {
  const body = readFileSync(
    join(root, "content/posts", meta.markdown),
    "utf8",
  );

  const { slug, markdown: _md, ...row } = meta;
  const post = { ...row, slug, body };

  const { data, error } = await supabase
    .from("posts")
    .upsert(post, { onConflict: "slug" })
    .select("slug, title, published")
    .single();

  if (error) {
    console.error(`Failed to seed ${slug}:`, error.message);
    process.exit(1);
  }

  console.log("Seeded:", data);
  console.log(`View at: /blog/${slug}`);
}
