"use client";

import { useEffect, useRef, useState } from "react";
import { renderMermaidChart } from "@/lib/render-mermaid";

type MermaidDiagramProps = {
  chart: string;
};

function removeMermaidErrorArtifacts() {
  document
    .querySelectorAll('[id^="dmermaid-"], .mermaid-error, [data-mermaid-error]')
    .forEach((node) => node.remove());
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const source = chart.trim();

    if (!source || !containerRef.current) return;

    setFailed(false);
    containerRef.current.innerHTML = "";

    renderMermaidChart(source)
      .then((svg) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Mermaid render failed:", error);
        }
        if (!cancelled) {
          setFailed(true);
        }
      })
      .finally(() => {
        removeMermaidErrorArtifacts();
      });

    return () => {
      cancelled = true;
      removeMermaidErrorArtifacts();
    };
  }, [chart]);

  if (failed) {
    return (
      <div
        className="my-8 rounded-lg border border-border bg-[var(--terminal-bg)] p-4"
        role="img"
        aria-label="Diagram could not be rendered"
      >
        <p className="mb-2 font-mono text-xs text-muted-2">Diagram preview unavailable</p>
        <pre className="overflow-x-auto font-mono text-xs text-muted whitespace-pre-wrap">
          {chart.trim()}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-8 flex justify-center overflow-x-auto rounded-lg border border-border bg-[var(--terminal-bg)] p-4 [&_svg]:max-w-full"
      aria-label="Diagram"
      aria-busy={!failed}
    />
  );
}
