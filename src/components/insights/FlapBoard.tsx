"use client";

/**
 * Departure-board style figures, after Componentry's split-flap display.
 * Each character cycles through random glyphs and settles left to right the
 * first time the board scrolls into view. Screen readers get the plain
 * value; reduced motion shows it settled.
 */
import { useEffect, useRef, useState } from "react";
import type { BoardRow } from "@/lib/insights";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%+-";
const SETTLE_STEP_MS = 70;
const ROW_DELAY_MS = 220;
const SPIN_MS = 450;
const FLIP_INTERVAL_MS = 55;

function glyphAt(seed: number) {
  return GLYPHS[Math.abs(Math.floor(Math.sin(seed) * 10000)) % GLYPHS.length];
}

function FlapCell({ char }: { char: string }) {
  return (
    <span className="relative flex h-9 w-[1.4rem] items-center justify-center overflow-hidden rounded-[5px] bg-[#241b17] font-mono text-lg font-medium text-[#f1e4d2] shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_2px_4px_rgb(0_0_0/0.35)] sm:h-11 sm:w-7 sm:text-2xl">
      {char === " " ? "\u00a0" : char}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/50" />
    </span>
  );
}

export function FlapBoard({ rows }: { rows: BoardRow[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const longest = Math.max(...rows.map((r) => r.value.length));
    const total = (rows.length - 1) * ROW_DELAY_MS + SPIN_MS + longest * SETTLE_STEP_MS;
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setElapsed(Infinity);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const t = now - start;
          setElapsed(t >= total ? Infinity : t);
          if (t < total) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [rows]);

  const charFor = (row: number, col: number, target: string) => {
    if (elapsed === Infinity) return target;
    if (target === " ") return " ";
    if (elapsed === null) return " ";
    const settleAt = row * ROW_DELAY_MS + SPIN_MS + col * SETTLE_STEP_MS;
    if (elapsed >= settleAt) return target;
    if (elapsed < row * ROW_DELAY_MS) return " ";
    return glyphAt(row * 97 + col * 13 + Math.floor(elapsed / FLIP_INTERVAL_MS));
  };

  return (
    <div ref={ref} className="rounded-[1.75rem] bg-royal-deep p-5 shadow-[0_30px_60px_-30px_rgb(58_45_40/0.7)] sm:p-8">
      <dl className="divide-y divide-white/10">
        {rows.map((row, r) => (
          <div key={row.label} className="grid gap-3 py-5 first:pt-0 last:pb-0 md:grid-cols-[11rem_auto_1fr] md:items-center md:gap-8">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-sovereign">{row.label}</dt>
            <dd>
              <span className="sr-only">{row.value}</span>
              <span aria-hidden className="flex gap-1">
                {row.value.split("").map((c, i) => (
                  <FlapCell key={i} char={charFor(r, i, c)} />
                ))}
              </span>
            </dd>
            <dd className="text-xs leading-relaxed text-white/55 md:text-sm">{row.note}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
