export type PostCategory =
  | "research"
  | "engineering"
  | "ai"
  | "tutorial"
  | "essay"
  | "book-notes"
  | "experiment";

export type Post = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  body: string;
  published_at: string;
  updated_at: string | null;
  published: boolean;
  featured: boolean;
  tags: string[];
  category: PostCategory;
};

export type Note = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  published_at: string;
  published: boolean;
  tags: string[];
  related_slugs: string[];
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  published_at: string;
  published: boolean;
  featured: boolean;
  tags: string[];
  tech: string[];
  github_url: string | null;
  live_url: string | null;
  timeline: string | null;
  learnings: string[];
};

export type ReadingItem = {
  id: string;
  title: string;
  author: string;
  status: "reading" | "queued" | "completed";
  note: string | null;
  href: string | null;
  sort_order: number;
};

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  research: "Research",
  engineering: "Engineering",
  ai: "AI",
  tutorial: "Tutorial",
  essay: "Essay",
  "book-notes": "Book Notes",
  experiment: "Experiment",
};
