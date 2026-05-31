"use client";

import { XIcon } from "@/components/icons/BrandIcons";
import { Link2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ShareButtonsProps = {
  title: string;
  slug: string;
};

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `/blog/${slug}`;

  async function copyLink() {
    await navigator.clipboard.writeText(
      typeof window !== "undefined"
        ? `${window.location.origin}/blog/${slug}`
        : url,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2 not-prose">
      <span className="text-xs font-mono uppercase tracking-[0.14em] text-muted-2">
        Share
      </span>
      <Button variant="ghost" size="sm" onClick={copyLink}>
        <Link2 className="h-3.5 w-3.5" />
        {copied ? "Copied" : "Copy link"}
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
          <XIcon className="h-3.5 w-3.5" />
          Post
        </a>
      </Button>
    </div>
  );
}
