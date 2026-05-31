"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { GRID_CELL_SIZE, isInteractiveTarget, snapToGrid } from "@/lib/grid";
import { gridSpring, prefersReducedMotion } from "@/lib/motion";
import { useGridPointer } from "@/hooks/useGridPointer";
import { cn } from "@/lib/utils";
import { useGridSoundsContext } from "@/components/stripe/GridSoundsProvider";
import GridImplosionBurst from "@/components/stripe/GridImplosionBurst";

type Burst = {
  id: number;
  x: number;
  y: number;
  kind: "move" | "click";
};

let burstId = 0;

export default function InteractiveGridLayer() {
  const pointer = useGridPointer();
  const { playCellClick, muted, performance } = useGridSoundsContext();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const prevCellRef = useRef<{ col: number; row: number } | null>(null);
  const prevPerformanceStep = useRef(-1);

  const cursorX = useSpring(pointer.x, gridSpring);
  const cursorY = useSpring(pointer.y, gridSpring);
  const snapX = useSpring(pointer.centerX, { ...gridSpring, stiffness: 500 });
  const snapY = useSpring(pointer.centerY, { ...gridSpring, stiffness: 500 });
  const highlightLeft = useSpring(pointer.left, gridSpring);
  const highlightTop = useSpring(pointer.top, gridSpring);
  const cursorScale = useSpring(1, { stiffness: 600, damping: 28 });

  const isPerforming = performance.active && performance.cell !== null;
  const perfCell = performance.cell;

  const spawnBurst = useCallback((x: number, y: number, kind: "move" | "click") => {
    const id = ++burstId;
    setBursts((prev) => [...prev.slice(-10), { id, x, y, kind }]);
  }, []);

  const removeBurst = useCallback((id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!pointer.isFinePointer || reducedMotion) {
      document.body.classList.remove("grid-cursor-active");
      return;
    }
    document.body.classList.add("grid-cursor-active");
    return () => document.body.classList.remove("grid-cursor-active");
  }, [pointer.isFinePointer, reducedMotion]);

  useEffect(() => {
    if (isPerforming && perfCell) {
      cursorX.set(perfCell.centerX);
      cursorY.set(perfCell.centerY);
      snapX.set(perfCell.centerX);
      snapY.set(perfCell.centerY);
      highlightLeft.set(perfCell.left);
      highlightTop.set(perfCell.top);
      return;
    }

    cursorX.set(pointer.x);
    cursorY.set(pointer.y);
    snapX.set(pointer.centerX);
    snapY.set(pointer.centerY);
    highlightLeft.set(pointer.left);
    highlightTop.set(pointer.top);
  }, [
    isPerforming,
    perfCell,
    pointer.x,
    pointer.y,
    pointer.centerX,
    pointer.centerY,
    pointer.left,
    pointer.top,
    cursorX,
    cursorY,
    snapX,
    snapY,
    highlightLeft,
    highlightTop,
  ]);

  useEffect(() => {
    if (!isPerforming || !perfCell) return;
    if (performance.step === prevPerformanceStep.current) return;

    prevPerformanceStep.current = performance.step;
    spawnBurst(perfCell.centerX, perfCell.centerY, "click");
    setPulse(true);
    cursorScale.set(0.55);
    cursorScale.set(1);
    const timer = window.setTimeout(() => setPulse(false), 260);
    return () => window.clearTimeout(timer);
  }, [
    isPerforming,
    perfCell,
    performance.step,
    spawnBurst,
    cursorScale,
  ]);

  useEffect(() => {
    if (!performance.active) {
      prevPerformanceStep.current = -1;
    }
  }, [performance.active]);

  useEffect(() => {
    if (!pointer.isFinePointer || reducedMotion || !pointer.isVisible || isPerforming)
      return;

    const prev = prevCellRef.current;
    if (prev && (prev.col !== pointer.col || prev.row !== pointer.row)) {
      spawnBurst(pointer.centerX, pointer.centerY, "move");
      cursorScale.set(0.65);
      cursorScale.set(1);
    }

    prevCellRef.current = { col: pointer.col, row: pointer.row };
  }, [
    pointer.col,
    pointer.row,
    pointer.centerX,
    pointer.centerY,
    pointer.isFinePointer,
    pointer.isVisible,
    reducedMotion,
    isPerforming,
    spawnBurst,
    cursorScale,
  ]);

  useEffect(() => {
    if (!pointer.isFinePointer || reducedMotion || isPerforming) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (isInteractiveTarget(event.target)) return;

      const cell = snapToGrid(event.clientX, event.clientY);
      spawnBurst(cell.centerX, cell.centerY, "click");
      setPulse(true);
      window.setTimeout(() => setPulse(false), 280);

      if (!muted) {
        void playCellClick(cell.col, cell.row, { loud: true });
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [
    pointer.isFinePointer,
    playCellClick,
    muted,
    reducedMotion,
    isPerforming,
    spawnBurst,
  ]);

  if (!pointer.isFinePointer || reducedMotion) return null;

  const visible = pointer.isVisible || isPerforming;
  const cellKey = isPerforming
    ? `perf-${performance.tuneId}-${performance.step}`
    : `${pointer.col}-${pointer.row}`;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5]">
      {bursts.map((burst) => (
        <GridImplosionBurst
          key={burst.id}
          x={burst.x}
          y={burst.y}
          kind={burst.kind}
          onComplete={() => removeBurst(burst.id)}
        />
      ))}

      <motion.div
        key={cellKey}
        className={cn(
          "grid-cell-highlight",
          pulse && "grid-cell-highlight-pulse",
          isPerforming && "grid-cell-highlight-performance",
        )}
        initial={{ scale: 1.45, opacity: 0.35 }}
        animate={{ scale: 1, opacity: visible ? 1 : 0 }}
        transition={{ duration: isPerforming ? 0.16 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: GRID_CELL_SIZE,
          height: GRID_CELL_SIZE,
          left: highlightLeft,
          top: highlightTop,
        }}
      />

      <motion.div
        className={cn(
          "grid-cursor grid-cursor-outer",
          isPerforming && "grid-cursor-performance",
        )}
        style={{
          x: cursorX,
          y: cursorY,
          scale: cursorScale,
          opacity: visible ? 1 : 0,
        }}
      />

      <motion.div
        className={cn(
          "grid-cursor grid-cursor-inner",
          isPerforming && "grid-cursor-inner-performance",
        )}
        style={{
          x: snapX,
          y: snapY,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
