"use client";

import { useInView, useCountUp } from "@/lib/motion";

/**
 * Plain stat figure — no card, no border, no shadow. Used for the
 * homepage credibility-numbers row, which SITEMAP.md specifies as
 * "plain type, no cards, no icons". Keeps the big-figure/small-unit
 * typographic pattern from docs/what-worked.md.
 *
 * Count-up animation follows the exact rules docs/what-worked.md records
 * from the first attempt (the one element that came out right there):
 *  - counts up from zero as it scrolls into view, ease-out over ~1.4s
 *  - once per page load, not every time it re-enters view
 *  - tabular figures so nothing reflows mid-count
 *  - React state starts at the FINAL value, matching what SSR renders —
 *    the correct number is what's in the markup; the count from zero is
 *    a client-only flourish layered on top, so a failed/slow script still
 *    leaves the right number on the page, never a stuck zero
 *  - honours prefers-reduced-motion by skipping the animation entirely
 * See lib/motion.ts's useInView/useCountUp — the same primitives now back
 * every count-up on the site, not just this component.
 */
export function StatFigure({
  label,
  value,
  prefix,
  unit,
  format,
}: {
  label: string;
  value: number;
  /** Shown before the number, at a larger size than a trailing unit —
   * e.g. "AED" in "AED 312M". */
  prefix?: string;
  /** Shown after the number, small and muted — e.g. "M", "days". */
  unit?: string;
  format?: (n: number) => string;
}) {
  const fmt = format ?? ((n: number) => Math.round(n).toLocaleString("en-AE"));
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const display = useCountUp(value, inView, 1400);

  return (
    <div className="text-center">
      <div className="flex items-baseline justify-center gap-1.5">
        {prefix && (
          <span className="text-2xl font-semibold text-slate/70 sm:text-3xl">
            {prefix}
          </span>
        )}
        <span
          ref={ref}
          className="text-5xl font-semibold tabular-nums text-slate sm:text-6xl"
        >
          {fmt(display)}
        </span>
        {unit && (
          <span className="text-[0.6em] font-medium text-slate/60">
            {unit}
          </span>
        )}
      </div>
      <div className="mt-2 text-sm text-slate/60">{label}</div>
    </div>
  );
}
