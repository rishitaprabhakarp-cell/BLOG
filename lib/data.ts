import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import readingTime from "reading-time";
import type { Note, Post, PostCategory, Project, ReadingItem } from "@/lib/database.types";

export type PostWithMeta = Post & {
  readingMinutes: number;
  readingTime: string;
};

export type NoteWithMeta = Note & {
  readingMinutes: number;
  readingTime: string;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase environment variables.");
  }
  return createSupabaseClient(url, key);
}

function enrichPost(post: Post): PostWithMeta {
  const stats = readingTime(post.body || post.description);
  return {
    ...post,
    readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
    readingTime: stats.text,
  };
}

function enrichNote(note: Note): NoteWithMeta {
  const stats = readingTime(note.body || note.description);
  return {
    ...note,
    readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
    readingTime: stats.text,
  };
}

export async function getPublishedPosts(): Promise<PostWithMeta[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return (data as Post[]).map(enrichPost);
}

export async function getFeaturedPosts(): Promise<PostWithMeta[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.featured);
}

export async function getPostBySlug(slug: string): Promise<PostWithMeta | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return enrichPost(data as Post);
}

export async function getPostsByCategory(
  category: PostCategory,
): Promise<PostWithMeta[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.category === category);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) tags.add(tag);
  }
  return [...tags].sort();
}

export async function getAllCategories(): Promise<PostCategory[]> {
  const posts = await getPublishedPosts();
  return [...new Set(posts.map((p) => p.category))];
}

export async function getRelatedPosts(
  post: PostWithMeta,
  limit = 3,
): Promise<PostWithMeta[]> {
  return getPublishedPosts()
    .then((posts) =>
      posts
        .filter((p) => p.slug !== post.slug)
        .map((p) => {
          const sharedTags = p.tags.filter((t) => post.tags.includes(t)).length;
          const sameCategory = p.category === post.category ? 2 : 0;
          return { post: p, score: sharedTags + sameCategory };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ post }) => post),
    );
}

export async function getPublishedNotes(): Promise<NoteWithMeta[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return (data as Note[]).map(enrichNote);
}

export async function getNoteBySlug(slug: string): Promise<NoteWithMeta | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return enrichNote(data as Note);
}

export async function getNoteBacklinks(slug: string): Promise<NoteWithMeta[]> {
  const notes = await getPublishedNotes();
  return notes.filter((n) => n.related_slugs.includes(slug));
}

export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getPublishedProjects();
  return projects.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Project;
}

export async function getReadingList(): Promise<ReadingItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("reading_list")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as ReadingItem[];
}

export async function getSiteStats() {
  const [posts, projects] = await Promise.all([
    getPublishedPosts(),
    getPublishedProjects(),
  ]);

  return {
    postCount: posts.length,
    projectCount: projects.length,
  };
}
