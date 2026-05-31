"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-border/50"
    >
      <div
        className={cn(
          "h-full bg-gradient-to-r from-accent to-accent-2 transition-[width] duration-150 ease-out",
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
