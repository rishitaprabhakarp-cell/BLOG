"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let toastCounter = 0;
const TOAST_DURATION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((curr) => curr.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = ++toastCounter;
      setItems((curr) => [...curr, { id, message, variant }]);
      window.setTimeout(() => {
        setItems((curr) => curr.filter((t) => t.id !== id));
      }, TOAST_DURATION_MS);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm text-foreground shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md ${
              t.variant === "success"
                ? "border-accent-fg/40 bg-card"
                : t.variant === "error"
                  ? "border-red-500/40 bg-card"
                  : "border-border-strong bg-card"
            }`}
          >
            <span
              aria-hidden="true"
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                t.variant === "success"
                  ? "bg-accent-fg"
                  : t.variant === "error"
                    ? "bg-red-500"
                    : "bg-muted-2"
              }`}
            />
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-muted-2 transition-colors hover:text-foreground"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
