"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useGridSounds } from "@/hooks/useGridSounds";
import {
  GRID_TUNES,
  getPerformanceCellFromPercent,
  type GridTune,
} from "@/lib/gridTunes";
import type { GridCell } from "@/lib/grid";

export type GridPerformance = {
  active: boolean;
  tuneId: string | null;
  step: number;
  cell: GridCell | null;
};

type GridExperienceContextValue = ReturnType<typeof useGridSounds> & {
  performance: GridPerformance;
  playingTuneId: string | null;
  playTune: (tuneId: string) => void;
  stopTune: () => void;
};

const GridExperienceContext = createContext<GridExperienceContextValue | null>(
  null,
);

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function GridSoundsProvider({ children }: { children: ReactNode }) {
  const { playVariant, muted, setMuted, toggleMuted, playCellClick } =
    useGridSounds();
  const [performance, setPerformance] = useState<GridPerformance>({
    active: false,
    tuneId: null,
    step: 0,
    cell: null,
  });
  const [playingTuneId, setPlayingTuneId] = useState<string | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  const stopTune = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    setPlayingTuneId(null);
    setPerformance({
      active: false,
      tuneId: null,
      step: 0,
      cell: null,
    });
  }, []);

  const playTune = useCallback(
    (tuneId: string) => {
      const tune = GRID_TUNES.find((t) => t.id === tuneId);
      if (!tune) return;

      stopTune();

      let cancelled = false;
      cancelRef.current = () => {
        cancelled = true;
      };

      setPlayingTuneId(tuneId);

      void (async () => {
        for (let i = 0; i < tune.notes.length; i++) {
          if (cancelled) break;

          const note = tune.notes[i];
          const cell = getPerformanceCellFromPercent(
            note.colPercent,
            note.rowPercent,
          );

          setPerformance({
            active: true,
            tuneId,
            step: i,
            cell,
          });

          if (!muted) {
            await playVariant(note.pitch, { loud: note.accent ?? false });
          } else {
            await sleep(Math.min(note.gapMs, 120));
          }

          if (cancelled) break;
          if (i < tune.notes.length - 1) {
            await sleep(note.gapMs);
          }
        }

        if (!cancelled) {
          setPerformance({
            active: false,
            tuneId: null,
            step: 0,
            cell: null,
          });
          setPlayingTuneId(null);
          cancelRef.current = null;
        }
      })();
    },
    [playVariant, muted, stopTune],
  );

  useEffect(() => () => stopTune(), [stopTune]);

  const value: GridExperienceContextValue = {
    muted,
    setMuted,
    toggleMuted,
    playCellClick,
    playVariant,
    performance,
    playingTuneId,
    playTune,
    stopTune,
  };

  return (
    <GridExperienceContext.Provider value={value}>
      {children}
    </GridExperienceContext.Provider>
  );
}

export function useGridSoundsContext() {
  const ctx = useContext(GridExperienceContext);
  if (!ctx) {
    throw new Error("useGridSoundsContext must be used within GridSoundsProvider");
  }
  return ctx;
}

export function useGridPerformance() {
  const { performance, playingTuneId, playTune, stopTune } =
    useGridSoundsContext();
  return { performance, playingTuneId, playTune, stopTune };
}

export function getTuneById(id: string): GridTune | undefined {
  return GRID_TUNES.find((t) => t.id === id);
}
