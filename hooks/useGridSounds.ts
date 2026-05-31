"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCellIndex } from "@/lib/grid";

const STORAGE_KEY = "grid-sounds-muted";

export type SoundVariant = {
  frequency: number;
  duration: number;
  type: OscillatorType;
  gain: number;
};

/** Pentatonic palette — C / E / G / low G / C5 */
export const SOUND_VARIANTS: SoundVariant[] = [
  { frequency: 261.63, duration: 0.1, type: "sine", gain: 0.11 },
  { frequency: 329.63, duration: 0.09, type: "triangle", gain: 0.1 },
  { frequency: 392.0, duration: 0.085, type: "sine", gain: 0.11 },
  { frequency: 196.0, duration: 0.07, type: "triangle", gain: 0.09 },
  { frequency: 523.25, duration: 0.08, type: "sine", gain: 0.1 },
];

function readMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeMuted(muted: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {
    /* ignore */
  }
}

async function playVariantOnContext(
  ctx: AudioContext,
  variantIndex: number,
  loud: boolean,
) {
  const variant = SOUND_VARIANTS[variantIndex % SOUND_VARIANTS.length];
  const gainMultiplier = loud ? 2.1 : 1;
  const durationMultiplier = loud ? 1.3 : 1;
  const duration = variant.duration * durationMultiplier;
  const peakGain = Math.min(variant.gain * gainMultiplier, 0.3);
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = variant.type;
  osc.frequency.setValueAtTime(variant.frequency, now);
  if (loud) {
    osc.frequency.exponentialRampToValueAtTime(
      variant.frequency * 0.78,
      now + duration,
    );
  }
  gain.gain.setValueAtTime(peakGain, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);

  if (loud && variantIndex !== 3) {
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(variant.frequency * 0.5, now);
    subGain.gain.setValueAtTime(0.09, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.85);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + duration);
  }

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration * 1000);
  });
}

export function useGridSounds() {
  const [muted, setMutedState] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setMutedState(readMuted());
  }, []);

  const ensureContext = useCallback(async () => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") await ctx.resume();
    return ctx;
  }, []);

  const playVariant = useCallback(
    async (variantIndex: number, options?: { loud?: boolean }) => {
      if (muted) return;
      const ctx = await ensureContext();
      if (!ctx) return;
      await playVariantOnContext(ctx, variantIndex, options?.loud ?? false);
    },
    [ensureContext, muted],
  );

  const playCellClick = useCallback(
    async (col: number, row: number, options?: { loud?: boolean }) => {
      const index = getCellIndex(col, row);
      await playVariant(index, options);
    },
    [playVariant],
  );

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
    writeMuted(value);
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);

  return { muted, setMuted, toggleMuted, playCellClick, playVariant };
}
