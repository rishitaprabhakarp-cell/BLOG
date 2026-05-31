"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  children?: React.ReactNode;
  className?: string;
  title?: string;
};

export default function CodeBlock({
  children,
  className,
  title,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") ?? "code";

  async function copy() {
    const text =
      typeof children === "string"
        ? children
        : (children as React.ReactElement<{ children?: string }>)?.props
            ?.children ?? "";
    await navigator.clipboard.writeText(String(text).trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-border bg-[#0d0d0d]">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
        <span className="text-xs font-mono text-muted-2">
          {title ?? language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-2 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-accent-fg" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre
        className={cn(
          "overflow-x-auto p-4 text-sm leading-relaxed font-mono text-[#e4e4e7]",
          className,
        )}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}
