"use client";

type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (
    id: string,
    text: string,
  ) => Promise<{ svg: string; bindFunctions?: (element: Element) => void }>;
};

let mermaidPromise: Promise<MermaidApi> | null = null;
let initialized = false;
let renderCounter = 0;
let renderChain: Promise<unknown> = Promise.resolve();

async function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidPromise) {
    mermaidPromise = (async () => {
      if (typeof window !== "undefined") {
        const createDOMPurify = (await import("dompurify")).default;
        createDOMPurify(window);
      }

      const mermaid = (await import("mermaid")).default;

      if (!initialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          suppressErrorRendering: true,
          deterministicIds: true,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        });
        initialized = true;
      }

      return mermaid;
    })();
  }
  return mermaidPromise;
}

async function getMermaid(): Promise<MermaidApi> {
  return loadMermaid();
}

/** Serialize renders — mermaid 11 can collide SVG ids when run in parallel. */
export function renderMermaidChart(source: string): Promise<string> {
  const trimmed = source.trim();
  const renderId = `mermaid-${++renderCounter}`;

  const result = renderChain.then(async () => {
    const mermaid = await getMermaid();
    const { svg } = await mermaid.render(renderId, trimmed);
    return svg;
  });

  renderChain = result.catch(() => undefined);
  return result;
}
