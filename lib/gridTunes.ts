import { GRID_CELL_SIZE, type GridCell } from "@/lib/grid";

/** Pitch class 0–4 mapped to pentatonic SOUND_VARIANTS */
export type TunePitch = 0 | 1 | 2 | 3 | 4;

export type TuneNote = {
  /** 0 = left edge, 1 = right edge of viewport grid */
  colPercent: number;
  /** 0 = top, 1 = bottom of viewport grid */
  rowPercent: number;
  /** Explicit pitch — decoupled from grid position */
  pitch: TunePitch;
  /** Ms before the next note starts */
  gapMs: number;
  accent?: boolean;
};

export type GridTune = {
  id: string;
  label: string;
  shortLabel: string;
  checkpointPercent: number;
  notes: TuneNote[];
};

function viewportGridBounds() {
  const width =
    typeof window !== "undefined" ? window.innerWidth : GRID_CELL_SIZE * 28;
  const height =
    typeof window !== "undefined" ? window.innerHeight : GRID_CELL_SIZE * 18;
  return {
    maxCol: Math.max(0, Math.floor(width / GRID_CELL_SIZE) - 1),
    maxRow: Math.max(0, Math.floor(height / GRID_CELL_SIZE) - 1),
  };
}

export function getPerformanceCellFromPercent(
  colPercent: number,
  rowPercent: number,
): GridCell {
  const { maxCol, maxRow } = viewportGridBounds();
  const col = Math.min(
    maxCol,
    Math.max(0, Math.round(colPercent * maxCol)),
  );
  const row = Math.min(
    maxRow,
    Math.max(0, Math.round(rowPercent * maxRow)),
  );
  const left = col * GRID_CELL_SIZE;
  const top = row * GRID_CELL_SIZE;

  return {
    col,
    row,
    left,
    top,
    centerX: left + GRID_CELL_SIZE / 2,
    centerY: top + GRID_CELL_SIZE / 2,
  };
}

/** @deprecated Use getPerformanceCellFromPercent */
export function getPerformanceCell(
  row: number,
  colOffsetFromRight = 2,
): GridCell {
  const { maxCol } = viewportGridBounds();
  const col = Math.max(0, maxCol - colOffsetFromRight);
  const left = col * GRID_CELL_SIZE;
  const top = row * GRID_CELL_SIZE;
  return {
    col,
    row,
    left,
    top,
    centerX: left + GRID_CELL_SIZE / 2,
    centerY: top + GRID_CELL_SIZE / 2,
  };
}

export const GRID_TUNES: GridTune[] = [
  {
    id: "horizon",
    label: "Horizon",
    shortLabel: "H1",
    checkpointPercent: 16,
    notes: [
      { colPercent: 0.06, rowPercent: 0.62, pitch: 0, gapMs: 0, accent: true },
      { colPercent: 0.18, rowPercent: 0.55, pitch: 1, gapMs: 148 },
      { colPercent: 0.32, rowPercent: 0.48, pitch: 2, gapMs: 148 },
      { colPercent: 0.46, rowPercent: 0.42, pitch: 4, gapMs: 148, accent: true },
      { colPercent: 0.60, rowPercent: 0.46, pitch: 2, gapMs: 132 },
      { colPercent: 0.74, rowPercent: 0.52, pitch: 1, gapMs: 132 },
      { colPercent: 0.88, rowPercent: 0.58, pitch: 0, gapMs: 168, accent: true },
      { colPercent: 0.72, rowPercent: 0.66, pitch: 1, gapMs: 120 },
      { colPercent: 0.54, rowPercent: 0.72, pitch: 2, gapMs: 120 },
      { colPercent: 0.36, rowPercent: 0.68, pitch: 4, gapMs: 120 },
      { colPercent: 0.20, rowPercent: 0.60, pitch: 2, gapMs: 120 },
      { colPercent: 0.08, rowPercent: 0.52, pitch: 0, gapMs: 220, accent: true },
    ],
  },
  {
    id: "cascade",
    label: "Cascade",
    shortLabel: "C2",
    checkpointPercent: 36,
    notes: [
      { colPercent: 0.10, rowPercent: 0.18, pitch: 4, gapMs: 0, accent: true },
      { colPercent: 0.22, rowPercent: 0.28, pitch: 2, gapMs: 125 },
      { colPercent: 0.14, rowPercent: 0.40, pitch: 1, gapMs: 125 },
      { colPercent: 0.30, rowPercent: 0.50, pitch: 0, gapMs: 125, accent: true },
      { colPercent: 0.48, rowPercent: 0.58, pitch: 1, gapMs: 110 },
      { colPercent: 0.62, rowPercent: 0.66, pitch: 2, gapMs: 110 },
      { colPercent: 0.78, rowPercent: 0.72, pitch: 4, gapMs: 110, accent: true },
      { colPercent: 0.90, rowPercent: 0.62, pitch: 2, gapMs: 100 },
      { colPercent: 0.76, rowPercent: 0.48, pitch: 1, gapMs: 100 },
      { colPercent: 0.58, rowPercent: 0.38, pitch: 0, gapMs: 100 },
      { colPercent: 0.40, rowPercent: 0.30, pitch: 1, gapMs: 100 },
      { colPercent: 0.24, rowPercent: 0.22, pitch: 2, gapMs: 100 },
      { colPercent: 0.50, rowPercent: 0.78, pitch: 3, gapMs: 180, accent: true },
      { colPercent: 0.68, rowPercent: 0.82, pitch: 0, gapMs: 200, accent: true },
    ],
  },
  {
    id: "signal",
    label: "Signal",
    shortLabel: "S3",
    checkpointPercent: 58,
    notes: [
      { colPercent: 0.08, rowPercent: 0.35, pitch: 4, gapMs: 0 },
      { colPercent: 0.24, rowPercent: 0.42, pitch: 4, gapMs: 95, accent: true },
      { colPercent: 0.40, rowPercent: 0.35, pitch: 2, gapMs: 95 },
      { colPercent: 0.56, rowPercent: 0.42, pitch: 2, gapMs: 95, accent: true },
      { colPercent: 0.72, rowPercent: 0.35, pitch: 1, gapMs: 95 },
      { colPercent: 0.88, rowPercent: 0.42, pitch: 1, gapMs: 95, accent: true },
      { colPercent: 0.92, rowPercent: 0.55, pitch: 0, gapMs: 110 },
      { colPercent: 0.76, rowPercent: 0.62, pitch: 1, gapMs: 100 },
      { colPercent: 0.60, rowPercent: 0.55, pitch: 2, gapMs: 100 },
      { colPercent: 0.44, rowPercent: 0.62, pitch: 4, gapMs: 100, accent: true },
      { colPercent: 0.28, rowPercent: 0.55, pitch: 2, gapMs: 100 },
      { colPercent: 0.12, rowPercent: 0.62, pitch: 1, gapMs: 100 },
      { colPercent: 0.06, rowPercent: 0.75, pitch: 0, gapMs: 130, accent: true },
      { colPercent: 0.22, rowPercent: 0.82, pitch: 1, gapMs: 110 },
      { colPercent: 0.50, rowPercent: 0.78, pitch: 2, gapMs: 110 },
      { colPercent: 0.78, rowPercent: 0.82, pitch: 4, gapMs: 240, accent: true },
    ],
  },
  {
    id: "drift",
    label: "Drift",
    shortLabel: "D4",
    checkpointPercent: 82,
    notes: [
      { colPercent: 0.92, rowPercent: 0.28, pitch: 0, gapMs: 0 },
      { colPercent: 0.78, rowPercent: 0.34, pitch: 1, gapMs: 200 },
      { colPercent: 0.62, rowPercent: 0.40, pitch: 2, gapMs: 200, accent: true },
      { colPercent: 0.46, rowPercent: 0.46, pitch: 1, gapMs: 200 },
      { colPercent: 0.30, rowPercent: 0.52, pitch: 0, gapMs: 200 },
      { colPercent: 0.14, rowPercent: 0.58, pitch: 1, gapMs: 220, accent: true },
      { colPercent: 0.08, rowPercent: 0.68, pitch: 2, gapMs: 180 },
      { colPercent: 0.20, rowPercent: 0.74, pitch: 4, gapMs: 180 },
      { colPercent: 0.38, rowPercent: 0.70, pitch: 2, gapMs: 170 },
      { colPercent: 0.56, rowPercent: 0.64, pitch: 1, gapMs: 170, accent: true },
      { colPercent: 0.74, rowPercent: 0.58, pitch: 0, gapMs: 170 },
      { colPercent: 0.90, rowPercent: 0.52, pitch: 1, gapMs: 170 },
      { colPercent: 0.82, rowPercent: 0.42, pitch: 2, gapMs: 160 },
      { colPercent: 0.64, rowPercent: 0.36, pitch: 4, gapMs: 160 },
      { colPercent: 0.44, rowPercent: 0.30, pitch: 2, gapMs: 280, accent: true },
      { colPercent: 0.24, rowPercent: 0.24, pitch: 0, gapMs: 320, accent: true },
    ],
  },
];
