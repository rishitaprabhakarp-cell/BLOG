"use client";

import { useEffect, useId, useRef, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
};

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict",
          fontFamily: "var(--font-mono), monospace",
        });

        const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim());
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-[var(--terminal-bg)] p-4 font-mono text-xs text-muted">
        {chart.trim()}
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-8 flex justify-center overflow-x-auto rounded-lg border border-border bg-[var(--terminal-bg)] p-4 [&_svg]:max-w-full"
      aria-label="Diagram"
    />
  );
}
