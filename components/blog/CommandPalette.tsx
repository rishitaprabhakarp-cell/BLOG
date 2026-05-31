"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import {
  FileText,
  FlaskConical,
  FolderKanban,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type CommandItem = {
  id: string;
  title: string;
  description?: string;
  href: string;
  kind: "writing" | "project" | "page";
  tags?: string[];
};

const kindIcons = {
  writing: FileText,
  project: FolderKanban,
  page: FlaskConical,
};

const kindLabels = {
  writing: "Writing",
  project: "Project",
  page: "Page",
};

type CommandPaletteProps = {
  items: CommandItem[];
  variant?: "default" | "console";
};

export default function CommandPalette({
  items,
  variant = "default",
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const fuse = new Fuse(items, {
    keys: ["title", "description", "tags"],
    threshold: 0.35,
    includeScore: true,
  });

  const results =
    query.trim().length > 0
      ? fuse.search(query, { limit: 8 }).map((r) => r.item)
      : items.slice(0, 8);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 font-mono text-xs tracking-wide transition-colors",
          variant === "console"
            ? "console-btn no-console-hover border border-[var(--highlight)] bg-[var(--highlight)] text-[var(--highlight-fg)]"
            : "rounded-lg border border-border text-muted",
        )}
        aria-label="Open command palette"
      >
        {variant === "console" ? (
          <>
            <span className="text-[var(--highlight-fg)]/60">[</span>
            <span>C</span>
            <span className="text-[var(--highlight-fg)]/60">]</span>
            <span className="ml-1 hidden sm:inline">CONSOLE</span>
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-2 sm:inline">
              ⌘K
            </kbd>
          </>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl gap-0 overflow-hidden border-border bg-[var(--terminal-bg)] p-0">
          <DialogHeader className="border-b border-border px-4 py-3">
            <DialogTitle className="font-mono text-xs uppercase tracking-wider text-muted-2">
              Console
            </DialogTitle>
            <Input
              autoFocus
              placeholder="Search writing, projects…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </DialogHeader>
          <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-2">
                No results for &ldquo;{query}&rdquo;
              </li>
            ) : (
              results.map((item, i) => {
                const Icon = kindIcons[item.kind];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={i === 0}
                      onClick={() => navigate(item.href)}
                      className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-fg" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{item.title}</span>
                          <span className="shrink-0 text-[10px] font-mono uppercase text-muted-2">
                            {kindLabels[item.kind]}
                          </span>
                        </div>
                        {item.description && (
                          <p className="truncate text-xs text-muted-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
