import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

/** Stripe.dev-style date: 2026.5.29 */
export function formatStripeDate(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Full lime fill — links & buttons (console button style) */
export const consoleHover =
  "console-hover hover:!bg-highlight hover:!text-highlight-fg hover:!border-highlight";

/** Border outline only — cards, tags, inputs */
export const consoleBorderHover =
  "console-border-hover transition-colors hover:!border-highlight focus:!border-highlight focus-visible:!border-highlight";

/** Card surfaces — border highlight on hover, content unchanged */
export const consoleCard = "console-card rounded-xl border border-border";

/** Content links — no green fill; accent text on hover only */
export const contentLink =
  "no-console-hover transition-colors hover:text-accent-fg";
