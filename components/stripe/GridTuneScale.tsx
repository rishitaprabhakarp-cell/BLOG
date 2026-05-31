"use client";

import { cn } from "@/lib/utils";
import { GRID_TUNES } from "@/lib/gridTunes";
import { useGridPerformance } from "@/components/stripe/GridSoundsProvider";

export default function GridTuneScale() {
  const { playingTuneId, playTune, stopTune } = useGridPerformance();

  return (
    <aside
      aria-label="Grid tune scale"
      className="grid-tune-scale fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      data-no-grid-sound
    >
      <div className="grid-tune-scale-track">
        <span className="grid-tune-scale-label">TUNES</span>

        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="grid-tune-scale-tick"
            style={{ top: `${8 + i * 10}%` }}
          />
        ))}

        {GRID_TUNES.map((tune) => {
          const active = playingTuneId === tune.id;
          return (
            <button
              key={tune.id}
              type="button"
              aria-pressed={active}
              aria-label={`Play ${tune.label} tune`}
              title={`Play ${tune.label}`}
              onClick={() => (active ? stopTune() : playTune(tune.id))}
              className={cn(
                "grid-tune-checkpoint no-console-hover",
                active && "grid-tune-checkpoint-active",
              )}
              style={{ top: `${tune.checkpointPercent}%` }}
            >
              <span className="grid-tune-checkpoint-bracket">[</span>
              <span className="grid-tune-checkpoint-key">
                {tune.shortLabel}
              </span>
              <span className="grid-tune-checkpoint-bracket">]</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
