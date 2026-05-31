"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Until mounted, render the button structure but hide the dynamic label
  // and rely on data-theme on <html> (set by inline script) to pick the icon
  // via CSS, avoiding a hydration mismatch.
  const label = mounted
    ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
    : "Toggle theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-card px-3 py-1.5 text-xs font-medium text-foreground"
    >
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <Sun
          aria-hidden="true"
          className="theme-icon-sun h-4 w-4 transition-transform duration-300"
        />
        <Moon
          aria-hidden="true"
          className="theme-icon-moon h-4 w-4 transition-transform duration-300"
        />
      </span>
      <span className="theme-label-dark hidden sm:inline">Dark</span>
      <span className="theme-label-light hidden sm:inline">Light</span>
      <span
        aria-hidden="true"
        className="ml-0.5 h-1.5 w-1.5 rounded-full bg-accent-fg shadow-[0_0_8px_currentColor]"
      />
    </button>
  );
}
