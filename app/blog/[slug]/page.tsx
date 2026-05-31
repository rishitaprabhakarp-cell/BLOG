import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleMetadata from "@/components/stripe/ArticleMetadata";
import SlashLabel from "@/components/stripe/SlashLabel";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import StatsTicker from "@/components/stripe/StatsTicker";
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from "@/lib/data";
import { formatStripeDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ raw?: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { raw } = await searchParams;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  if (raw === "1") {
    return (
      <pre className="mx-auto max-w-3xl whitespace-pre-wrap p-8 font-mono text-sm">
        {`# ${post.title}\n\n${post.body}`}
      </pre>
    );
  }

  const related = await getRelatedPosts(post);

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto w-full max-w-[1400px] px-6 py-10 sm:px-10 lg:py-14">
        <header className="border-b border-border pb-10">
          <p className="mb-4 font-mono text-xs text-muted-2">
            {formatStripeDate(post.published_at)}
          </p>
          <h1 className="max-w-4xl font-display text-3xl font-semibold leading-tight tracking-tight text-foreground/90 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="mt-4 max-w-2xl text-lg text-muted">{post.subtitle}</p>
          )}
        </header>

        <div className="grid gap-12 py-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <ArticleMetadata post={post} />

          <div>
            <SlashLabel className="mb-8 block">ARTICLE</SlashLabel>
            <MarkdownRenderer content={post.body} />
          </div>
        </div>

        {related.length > 0 && (
          <section className="border-t border-border pt-10">
            <SlashLabel className="mb-6 block">RELATED</SlashLabel>
            <ul className="space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group inline-flex items-center gap-2 font-medium"
                  >
                    {r.title}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <StatsTicker />
    </>
  );
}
