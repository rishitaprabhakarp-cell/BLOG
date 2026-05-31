"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

const GLYPHS =
  "アイウエオカキクケコサシスセソ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*";

type MatrixTextProps = {
  text: string;
  className?: string;
  /** Delay before the first letter starts decoding (seconds) */
  delay?: number;
  /** Stagger between each letter (seconds) */
  stagger?: number;
};

export default function MatrixText({
  text,
  className,
  delay = 0.4,
  stagger = 0.07,
}: MatrixTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (prefersReducedMotion()) {
      container.textContent = text;
      return;
    }

    const chars = [...text];
    container.innerHTML = chars
      .map((char) => {
        if (char === " ") {
          return '<span aria-hidden="true">&nbsp;</span>';
        }
        return `<span class="matrix-char inline-block min-w-[0.52em] text-center" data-final="${char}"></span>`;
      })
      .join("");

    const spans = container.querySelectorAll<HTMLSpanElement>(".matrix-char");
    const tweens: gsap.core.Tween[] = [];

    spans.forEach((span, index) => {
      const finalChar = span.dataset.final ?? "";
      const scrambleCount = 10 + Math.floor(Math.random() * 8);
      const state = { tick: 0 };

      const tween = gsap.to(state, {
        tick: scrambleCount,
        duration: 0.55,
        delay: delay + index * stagger,
        ease: "none",
        onUpdate: () => {
          const step = Math.floor(state.tick);
          if (step >= scrambleCount - 1) {
            span.textContent = finalChar;
          } else {
            span.textContent =
              GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "0";
          }
        },
        onComplete: () => {
          span.textContent = finalChar;
          span.classList.add("matrix-char-settled");
          gsap.fromTo(
            span,
            {
              color: "var(--accent-fg)",
              textShadow: "0 0 14px var(--accent)",
            },
            {
              color: "var(--orange)",
              textShadow: "0 0 0px transparent",
              duration: 0.3,
              ease: "power2.out",
            },
          );
        },
      });

      tweens.push(tween);
    });

    return () => {
      for (const tween of tweens) tween.kill();
    };
  }, [text, delay, stagger]);

  return (
    <span
      ref={containerRef}
      className={cn("matrix-text font-mono", className)}
      aria-label={text}
    />
  );
}
