"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { CATEGORY_LABELS, type PostCategory } from "@/lib/database.types";
import type { PostWithMeta } from "@/lib/data";
import { cn, formatStripeDate } from "@/lib/utils";
import SlashLabel from "@/components/stripe/SlashLabel";
import BracketTag from "@/components/stripe/BracketTag";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

type BlogListProps = {
  posts: PostWithMeta[];
  tags: string[];
  categories: PostCategory[];
};

function topicCount(posts: PostWithMeta[], category: PostCategory) {
  return posts.filter((p) => p.category === category).length;
}

export default function BlogList({ posts, tags, categories }: BlogListProps) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 sm:px-10 lg:py-14">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-10 flex items-start justify-between gap-4 border-b border-border pb-8"
      >
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          Blog
        </h1>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="font-mono text-sm text-[var(--orange)]"
        >
          ({posts.length})
        </motion.span>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <motion.aside
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          <SlashLabel>FILTERS</SlashLabel>
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-2">
              Topic
            </p>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <BracketTag>
                    {CATEGORY_LABELS[cat]} ({topicCount(posts, cat)})
                  </BracketTag>
                </li>
              ))}
            </ul>
            {tags.length > 0 && (
              <>
                <p className="pt-2 font-mono text-xs uppercase tracking-wider text-muted-2">
                  Tags
                </p>
                <ul className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li key={tag}>
                      <BracketTag>{tag}</BracketTag>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </motion.aside>

        <div>
          <div className="mb-3 grid grid-cols-[120px_1fr_24px] gap-4 border-b border-border pb-2 sm:grid-cols-[140px_1fr_32px]">
            <SlashLabel>DATE</SlashLabel>
            <SlashLabel>NAME</SlashLabel>
            <span />
          </div>

          {posts.length === 0 ? (
            <div className="empty-state mt-6">No published posts yet.</div>
          ) : (
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {posts.map((post) => (
                <motion.li key={post.slug} variants={staggerItem}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className={cn(
                      "group grid grid-cols-[120px_1fr_24px] items-center gap-4 border-b border-border py-4 sm:grid-cols-[140px_1fr_32px]",
                    )}
                  >
                    <span className="flex items-center gap-2 font-mono text-xs">
                      <span className="inline-block h-2 w-2 bg-accent" />
                      {formatStripeDate(post.published_at)}
                    </span>
                    <span className="flex items-center gap-2 text-base font-medium tracking-tight">
                      {post.title}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                    <Plus className="h-3.5 w-3.5 text-muted-2" />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>
    </div>
  );
}
