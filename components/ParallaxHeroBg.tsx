"use client";

import { useEffect, useRef } from "react";

export default function ParallaxHeroBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let raf = 0;
    const update = () => {
      const y = window.scrollY * 0.3;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px] w-full will-change-transform"
    >
      <div className="absolute left-1/2 top-[-220px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,_var(--hero-blob-1),_transparent_70%)] blur-3xl" />
      <div className="absolute right-[-120px] top-[80px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(closest-side,_var(--hero-blob-2),_transparent_70%)] blur-3xl" />
      <div className="absolute left-[-120px] top-[180px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,_var(--hero-blob-3),_transparent_70%)] blur-3xl" />
    </div>
  );
}
