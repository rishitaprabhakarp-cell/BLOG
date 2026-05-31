/**
 * Seed the first blog post into Supabase.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (Dashboard → Settings → API).
 * Run: node scripts/seed-first-post.mjs
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
    // .env.local optional if vars already exported
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const body = readFileSync(
  join(root, "content/posts/bangalore-traffic-demand-prediction.md"),
  "utf8",
);

const post = {
  slug: "bangalore-traffic-demand-prediction",
  title: "Bangalore Traffic Demand Prediction",
  subtitle: "Project Whitepaper — Plain-Language Edition",
  description:
    "How we reached a 91.38 public score predicting city-grid traffic demand with temporal features, CatBoost, XGBoost, and an honest validation strategy built for hidden test data.",
  body,
  published_at: "2026-05-31",
  published: true,
  featured: true,
  category: "research",
  tags: [
    "machine-learning",
    "traffic",
    "catboost",
    "xgboost",
    "ensemble",
    "feature-engineering",
  ],
};

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase
  .from("posts")
  .upsert(post, { onConflict: "slug" })
  .select("slug, title, published")
  .single();

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log("Seeded post:", data);
console.log("View at: /blog/bangalore-traffic-demand-prediction");
