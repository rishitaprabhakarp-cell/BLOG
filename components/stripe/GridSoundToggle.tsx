"use client";

import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGridSoundsContext } from "@/components/stripe/GridSoundsProvider";

export default function GridSoundToggle() {
  const { muted, toggleMuted } = useGridSoundsContext();

  return (
    <button
      type="button"
      onClick={toggleMuted}
      aria-pressed={!muted}
      aria-label={muted ? "Unmute grid sounds" : "Mute grid sounds"}
      title={muted ? "Unmute grid sounds" : "Mute grid sounds"}
      className={cn(
        "no-console-hover group inline-flex items-center gap-1 border border-transparent px-2 py-1 font-mono text-xs tracking-wide text-[var(--nav-fg-muted)] transition-colors",
        "hover:border-[var(--highlight)] hover:bg-[var(--highlight)] hover:text-[var(--highlight-fg)]",
      )}
    >
      <span className="text-[var(--nav-bracket)] group-hover:text-[var(--highlight-fg)]">[</span>
      <span className="text-[var(--nav-key)] group-hover:text-[var(--highlight-fg)]">S</span>
      <span className="text-[var(--nav-bracket)] group-hover:text-[var(--highlight-fg)]">]</span>
      {muted ? (
        <VolumeX className="ml-1 h-3.5 w-3.5" aria-hidden />
      ) : (
        <Volume2 className="ml-1 h-3.5 w-3.5" aria-hidden />
      )}
      <span className="ml-0.5 hidden sm:inline">SOUND</span>
    </button>
  );
}
