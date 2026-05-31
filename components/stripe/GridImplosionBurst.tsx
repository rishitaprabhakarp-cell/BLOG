"use client";

import { useEffect } from "react";

type GridImplosionBurstProps = {
  x: number;
  y: number;
  kind: "move" | "click";
  onComplete: () => void;
};

export default function GridImplosionBurst({
  x,
  y,
  kind,
  onComplete,
}: GridImplosionBurstProps) {
  useEffect(() => {
    const duration = kind === "click" ? 480 : 340;
    const timer = window.setTimeout(onComplete, duration);
    return () => window.clearTimeout(timer);
  }, [kind, onComplete]);

  const ringCount = kind === "click" ? 3 : 2;

  return (
    <div
      className={`grid-implosion grid-implosion-${kind}`}
      style={{ left: x, top: y }}
    >
      {Array.from({ length: ringCount }, (_, i) => (
        <span
          key={i}
          className="grid-implosion-ring"
          style={{ animationDelay: `${i * 55}ms` }}
        />
      ))}
      <span className="grid-implosion-core" />
      {[0, 45, 90, 135].map((angle) => (
        <span
          key={angle}
          className="grid-implosion-ray-wrap"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <span className="grid-implosion-ray" />
        </span>
      ))}
    </div>
  );
}
