import type { Metadata } from "next";
import BlogList from "@/components/stripe/BlogList";
import StatsTicker from "@/components/stripe/StatsTicker";
import { getAllCategories, getAllTags, getPublishedPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on research, engineering, and AI.",
};

export default async function BlogPage() {
  const [posts, tags, categories] = await Promise.all([
    getPublishedPosts(),
    getAllTags(),
    getAllCategories(),
  ]);

  return (
    <>
      <BlogList posts={posts} tags={tags} categories={categories} />
      <StatsTicker />
    </>
  );
}
