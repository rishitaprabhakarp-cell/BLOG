"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

type AnimatedStatsTickerProps = {
  items: string[];
};

export default function AnimatedStatsTicker({ items }: AnimatedStatsTickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const spans = el.querySelectorAll<HTMLElement>("[data-ticker-item]");
    gsap.fromTo(
      spans,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      },
    );
  }, [items]);

  return (
    <div className="border-t border-border bg-background overflow-hidden">
      <div
        ref={ref}
        className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3 sm:px-10"
      >
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-6">
            {i > 0 && (
              <span aria-hidden className="hidden sm:inline text-border-strong">
                |
              </span>
            )}
            <span
              data-ticker-item
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-2"
            >
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
