"use client";

import { Search as SearchIcon, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  searchIndex,
  type SearchItem,
  type SearchItemKind,
} from "@/lib/search";

type Props = {
  index: SearchItem[];
};

const kindBadgeClass: Record<SearchItemKind, string> = {
  project: "bg-accent-soft text-accent-fg",
  skill: "bg-accent-soft text-accent-fg",
  achievement: "bg-accent-soft text-accent-fg",
  blog: "bg-accent-soft text-accent-fg",
};

export default function Search({ index }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const inputId = useId();

  const results = useMemo(
    () => searchIndex(index, query, 8),
    [index, query],
  );

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  // Cmd/Ctrl+K to open, Esc to close (only when focused on body / not in inputs)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTypingInExternalInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable) &&
        target.id !== inputId;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        if (isTypingInExternalInput) return;
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, inputId]);

  // Focus input on open and lock body scroll while modal is open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  function navigate(item: SearchItem) {
    close();
    if (typeof window !== "undefined") {
      // Defer so the modal unmounts before the browser scrolls.
      requestAnimationFrame(() => {
        window.location.hash = item.anchor;
      });
    }
  }

  function onListKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIdx];
      if (item) navigate(item);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-card px-3 py-1.5 text-xs font-medium text-muted"
      >
        <SearchIcon aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-1 hidden rounded border border-border px-1.5 py-px text-[10px] font-mono text-muted-2 sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={inputId}
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh] sm:pt-[15vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border-strong bg-background shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <SearchIcon
                aria-hidden="true"
                className="h-4 w-4 text-accent-fg"
              />
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onListKey}
                placeholder="Search projects, skills, achievements…"
                aria-controls={listboxId}
                aria-activedescendant={
                  results.length > 0 ? `${listboxId}-${activeIdx}` : undefined
                }
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-2 focus:outline-none"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="rounded-md p-1 text-muted-2 transition-colors"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <div
              id={listboxId}
              role="listbox"
              className="max-h-[60vh] overflow-y-auto"
            >
              {query.trim() === "" ? (
                <p className="px-4 py-8 text-center text-sm text-muted-2">
                  Start typing to search projects, skills, and achievements.
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-2">
                  No results for{" "}
                  <span className="text-foreground">{`"${query}"`}</span>.
                </p>
              ) : (
                <ul>
                  {results.map((item, i) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        id={`${listboxId}-${i}`}
                        role="option"
                        aria-selected={i === activeIdx}
                        onMouseEnter={() => setActiveIdx(i)}
                        onClick={() => navigate(item)}
                        className={`flex w-full items-start justify-between gap-3 border-l-2 px-4 py-3 text-left transition-colors ${
                          i === activeIdx
                            ? "border-accent-fg bg-accent-soft"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate text-sm font-medium text-foreground">
                            <Highlight text={item.title} query={query} />
                          </span>
                          {item.description && (
                            <span className="truncate text-xs text-muted-2">
                              <Highlight
                                text={item.description}
                                query={query}
                              />
                            </span>
                          )}
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${kindBadgeClass[item.kind]}`}
                        >
                          {item.sectionLabel}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-card px-4 py-2 text-[11px] text-muted-2">
              <div className="flex items-center gap-3">
                <span>
                  <Kbd>↑</Kbd> <Kbd>↓</Kbd> navigate
                </span>
                <span>
                  <Kbd>↵</Kbd> select
                </span>
                <span>
                  <Kbd>esc</Kbd> close
                </span>
              </div>
              <span>{results.length > 0 ? `${results.length} results` : ""}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-background px-1 py-px font-mono text-[10px] text-muted">
      {children}
    </kbd>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark
            key={i}
            className="rounded bg-accent-soft px-0.5 text-accent-fg"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
