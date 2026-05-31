"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  items: TocItem[];
  className?: string;
};

export default function TableOfContents({
  items,
  className,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className={cn("space-y-3", className)}>
      <p className="text-xs font-mono uppercase tracking-[0.16em] text-muted-2">
        On this page
      </p>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${Math.max(0, item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                "block py-0.5 transition-colors",
                activeId === item.id
                  ? "bg-highlight text-highlight-fg font-medium px-1 -mx-1"
                  : "text-muted",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
