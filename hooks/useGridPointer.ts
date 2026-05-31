"use client";

import { useEffect, useState } from "react";
import { snapToGrid } from "@/lib/grid";

export type GridPointerState = {
  x: number;
  y: number;
  col: number;
  row: number;
  left: number;
  top: number;
  centerX: number;
  centerY: number;
  isFinePointer: boolean;
  isVisible: boolean;
};

const initialState: GridPointerState = {
  x: 0,
  y: 0,
  col: 0,
  row: 0,
  left: 0,
  top: 0,
  centerX: 0,
  centerY: 0,
  isFinePointer: false,
  isVisible: false,
};

export function useGridPointer(): GridPointerState {
  const [state, setState] = useState<GridPointerState>(initialState);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) {
      setState((prev) => ({ ...prev, isFinePointer: false, isVisible: false }));
      return;
    }

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;
    let hasPending = false;

    const flush = () => {
      rafId = 0;
      if (!hasPending) return;
      hasPending = false;
      const cell = snapToGrid(pendingX, pendingY);
      setState({
        x: pendingX,
        y: pendingY,
        ...cell,
        isFinePointer: true,
        isVisible: true,
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      pendingX = event.clientX;
      pendingY = event.clientY;
      hasPending = true;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    const onPointerLeave = () => {
      setState((prev) => ({ ...prev, isVisible: false }));
    };

    const onPointerEnter = () => {
      setState((prev) => ({ ...prev, isFinePointer: true, isVisible: true }));
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.documentElement.addEventListener("pointerenter", onPointerEnter);

    setState((prev) => ({ ...prev, isFinePointer: true }));

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.removeEventListener("pointerenter", onPointerEnter);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return state;
}
