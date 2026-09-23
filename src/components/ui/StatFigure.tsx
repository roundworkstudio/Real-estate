"use client";

import { useEffect, useRef, useState } from "react";

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
 */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

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
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;
        observer.disconnect();

        const duration = 1400;
        const start = performance.now();

        function tick(now: number) {
          const t = Math.min((now - start) / duration, 1);
          setDisplay(value * easeOutCubic(t));
          if (t < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

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
