"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import CommandPalette, { type CommandItem } from "@/components/blog/CommandPalette";
import ThemeToggle from "@/components/ThemeToggle";
import GridSoundToggle from "@/components/stripe/GridSoundToggle";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/motion";

const navItems = [
  { key: "H", href: "/", label: "HOME" },
  { key: "B", href: "/blog", label: "BLOG" },
  { key: "P", href: "/projects", label: "PROJECTS" },
  { key: "A", href: "/about", label: "ABOUT" },
];

type NavbarProps = {
  commandItems: CommandItem[];
};

export default function Navbar({ commandItems }: NavbarProps) {
  const pathname = usePathname();

  return (
    <motion.header
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 border-b border-border bg-[var(--nav-bg)] backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-6 py-3 sm:px-10">
        <nav
          aria-label="Primary"
          className="nav-primary flex flex-wrap items-center gap-1 sm:gap-2"
        >
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "nav-tab no-console-hover group inline-flex items-center gap-0.5 border px-2 py-1 font-mono text-xs tracking-wide transition-colors",
                  active
                    ? "nav-tab-active border-[var(--highlight)] bg-[var(--highlight)] text-[var(--highlight-fg)]"
                    : "border-transparent text-[var(--nav-fg-muted)]",
                )}
              >
                <span className="nav-bracket text-[var(--nav-bracket)]">[</span>
                <span className="nav-key text-[var(--nav-key)]">{item.key}</span>
                <span className="nav-bracket text-[var(--nav-bracket)]">]</span>
                <span className="ml-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <GridSoundToggle />
          <CommandPalette items={commandItems} variant="console" />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
