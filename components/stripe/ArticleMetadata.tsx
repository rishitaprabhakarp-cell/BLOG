"use client";

import { useState } from "react";
import { Copy, FileText } from "lucide-react";
import { XIcon } from "@/components/icons/BrandIcons";
import BracketTag from "@/components/stripe/BracketTag";
import SlashLabel from "@/components/stripe/SlashLabel";
import { CATEGORY_LABELS } from "@/lib/database.types";
import type { PostWithMeta } from "@/lib/data";
import { formatStripeDate } from "@/lib/utils";

type ArticleMetadataProps = {
  post: PostWithMeta;
};

export default function ArticleMetadata({ post }: ArticleMetadataProps) {
  const [copied, setCopied] = useState(false);

  async function copyMarkdown() {
    const md = `# ${post.title}\n\n${post.body}`;
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`;

  return (
    <aside className="space-y-8">
      <SlashLabel>METADATA</SlashLabel>

      <dl className="space-y-4 font-mono text-xs">
        <div className="grid grid-cols-[88px_1fr] gap-2">
          <dt className="text-muted-2">DATE:</dt>
          <dd>{formatStripeDate(post.published_at)}</dd>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-2">
          <dt className="text-muted-2">READ:</dt>
          <dd>{post.readingTime}</dd>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-2 items-start">
          <dt className="text-muted-2">TOPIC:</dt>
          <dd className="flex flex-wrap gap-1.5">
            <BracketTag>{CATEGORY_LABELS[post.category]}</BracketTag>
            {post.tags.map((tag) => (
              <BracketTag key={tag}>{tag}</BracketTag>
            ))}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={copyMarkdown}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted"
        >
          <Copy className="h-3 w-3" />
          {copied ? "Copied" : "Copy for LLM"}
        </button>
        <a
          href={`/blog/${post.slug}?raw=1`}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted"
        >
          <FileText className="h-3 w-3" />
          View as Markdown
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted"
        >
          <XIcon className="h-3 w-3" />
          Share
        </a>
      </div>
    </aside>
  );
}
