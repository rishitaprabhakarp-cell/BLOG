import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import type { PostWithMeta } from "@/lib/data";
import type { Project } from "@/lib/database.types";
import type { ReadingItem } from "@/lib/database.types";
import SlashLabel from "@/components/stripe/SlashLabel";
import TerminalFrame from "@/components/stripe/TerminalFrame";
import BracketTag from "@/components/stripe/BracketTag";
import HeroTitle from "@/components/motion/HeroTitle";
import MotionReveal from "@/components/motion/MotionReveal";
import { MotionStagger, MotionStaggerItem } from "@/components/motion/MotionStagger";
import { contentLink, formatStripeDate } from "@/lib/utils";

type HomeContentProps = {
  featuredPosts: PostWithMeta[];
  projects: Project[];
  recentPosts: PostWithMeta[];
  readingList: ReadingItem[];
};

export default function HomeContent({
  featuredPosts,
  projects,
  recentPosts,
  readingList,
}: HomeContentProps) {
  const featured = featuredPosts[0];
  const secondFeatured = featuredPosts[1];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10">
      <section className="relative border-b border-border py-16 sm:py-24 lg:py-28">
        <HeroTitle />
      </section>

      <MotionReveal>
        <section className="border-b border-border py-12">
          <SlashLabel className="mb-8 block">FEATURED POST</SlashLabel>
          {featured ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <TerminalFrame figure="FIG. 1" label="FEATURED POST">
                <Link
                  href={`/blog/${featured.slug}`}
                  className={`group block p-6 sm:p-8 ${contentLink}`}
                >
                  <div className="mb-4 flex flex-wrap gap-2">
                    {featured.tags.slice(0, 3).map((tag) => (
                      <BracketTag key={tag}>{tag}</BracketTag>
                    ))}
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {featured.title}
                    <ArrowUpRight className="ml-1 inline h-5 w-5 opacity-60" />
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {featured.description}
                  </p>
                  <p className="mt-6 font-mono text-xs text-muted-2">
                    {formatStripeDate(featured.published_at)} · {featured.readingMinutes} min
                  </p>
                </Link>
              </TerminalFrame>

              {secondFeatured ? (
                <TerminalFrame figure="FIG. 2" label="FEATURED POST">
                  <Link
                    href={`/blog/${secondFeatured.slug}`}
                    className={`group block p-6 sm:p-8 ${contentLink}`}
                  >
                    <div className="mb-4 flex flex-wrap gap-2">
                      {secondFeatured.tags.slice(0, 3).map((tag) => (
                        <BracketTag key={tag}>{tag}</BracketTag>
                      ))}
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      {secondFeatured.title}
                      <ArrowUpRight className="ml-1 inline h-5 w-5 opacity-60" />
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {secondFeatured.description}
                    </p>
                    <p className="mt-6 font-mono text-xs text-muted-2">
                      {formatStripeDate(secondFeatured.published_at)} · {secondFeatured.readingMinutes} min
                    </p>
                  </Link>
                </TerminalFrame>
              ) : (
                <TerminalFrame figure="FIG. 2" label="FEATURED POST">
                  <div className="empty-state border-0">No second featured post.</div>
                </TerminalFrame>
              )}
            </div>
          ) : (
            <div className="empty-state">No featured posts yet. Publish content in Supabase.</div>
          )}
        </section>
      </MotionReveal>

      <MotionReveal delay={0.05}>
        <section className="border-b border-border p-8">
          <SlashLabel className="mb-6 block">PROJECTS</SlashLabel>
          {projects.length === 0 ? (
            <div className="empty-state">No projects yet.</div>
          ) : (
            <MotionStagger as="ul" className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <MotionStaggerItem as="li" key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`group flex items-start justify-between gap-4 ${contentLink}`}
                  >
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 4).map((t) => (
                          <BracketTag key={t}>{t}</BracketTag>
                        ))}
                      </div>
                    </div>
                    <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </MotionStaggerItem>
              ))}
            </MotionStagger>
          )}
          <Link href="/projects" className={`mt-6 inline-block font-mono text-xs ${contentLink}`}>
            View all projects →
          </Link>
        </section>
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <section className="border-b border-border py-12">
          <SlashLabel className="mb-6 block">READING LIST</SlashLabel>
          {readingList.length === 0 ? (
            <div className="empty-state">No reading list items yet.</div>
          ) : (
            <MotionStagger as="ul" className="divide-y divide-border border border-border">
              {readingList.map((item) => (
                <MotionStaggerItem
                  as="li"
                  key={item.id}
                  className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    {item.href ? (
                      <Link href={item.href} className={`font-medium ${contentLink}`}>
                        {item.title}
                      </Link>
                    ) : (
                      <p className="font-medium">{item.title}</p>
                    )}
                    <p className="text-sm text-muted-2">{item.author}</p>
                  </div>
                  <BracketTag>{item.status}</BracketTag>
                </MotionStaggerItem>
              ))}
            </MotionStagger>
          )}
        </section>
      </MotionReveal>

      <MotionReveal delay={0.1}>
        <section className="py-12">
          <SlashLabel className="mb-6 block">RECENT POSTS</SlashLabel>
          {recentPosts.length === 0 ? (
            <div className="empty-state">No posts yet.</div>
          ) : (
            <MotionStagger as="ul">
              {recentPosts.slice(0, 5).map((post) => (
                <MotionStaggerItem as="li" key={post.slug} className="border-b border-border">
                  <Link
                    href={`/blog/${post.slug}`}
                    className={`group flex items-center justify-between gap-4 py-4 ${contentLink}`}
                  >
                    <span className="font-medium">{post.title}</span>
                    <span className="font-mono text-xs opacity-70">
                      {formatStripeDate(post.published_at)}
                    </span>
                  </Link>
                </MotionStaggerItem>
              ))}
            </MotionStagger>
          )}
          <Link href="/blog" className={`mt-6 inline-block font-mono text-xs ${contentLink}`}>
            All writing →
          </Link>
        </section>
      </MotionReveal>
    </div>
  );
}
