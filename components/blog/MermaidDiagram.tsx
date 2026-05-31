"use client";

import { useEffect, useId, useRef } from "react";

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
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const source = chart.trim();
      if (!source || !containerRef.current) return;

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict",
          suppressErrorRendering: true,
          fontFamily: "var(--font-mono), monospace",
        });

        await mermaid.parse(source);

        const { svg } = await mermaid.render(`mermaid-${id}`, source);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = "";
          const fallback = document.createElement("pre");
          fallback.className =
            "overflow-x-auto rounded-lg border border-border bg-[var(--terminal-bg)] p-4 font-mono text-xs text-muted whitespace-pre-wrap";
          fallback.textContent = source;
          containerRef.current.appendChild(fallback);
        }
      } finally {
        removeMermaidErrorArtifacts();
      }
    }

    render();
    return () => {
      cancelled = true;
      removeMermaidErrorArtifacts();
    };
  }, [chart, id]);

  return (
    <div
      ref={containerRef}
      className="my-8 flex justify-center overflow-x-auto rounded-lg border border-border bg-[var(--terminal-bg)] p-4 [&_svg]:max-w-full"
      aria-label="Diagram"
    />
  );
}
