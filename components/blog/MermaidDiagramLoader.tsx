"use client";

import dynamic from "next/dynamic";

const MermaidDiagram = dynamic(() => import("@/components/blog/MermaidDiagram"), {
  ssr: false,
  loading: () => (
    <div
      className="my-8 flex min-h-32 items-center justify-center rounded-lg border border-border bg-[var(--terminal-bg)] p-4"
      aria-busy="true"
      aria-label="Loading diagram"
    >
      <span className="font-mono text-xs text-muted-2">Loading diagram…</span>
    </div>
  ),
});

type MermaidDiagramLoaderProps = {
  chart: string;
};

export default function MermaidDiagramLoader({ chart }: MermaidDiagramLoaderProps) {
  return <MermaidDiagram chart={chart} />;
}
