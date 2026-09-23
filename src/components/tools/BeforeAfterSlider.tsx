"use client";

import { useRef, useState } from "react";

export type CapexItem = { label: string; amount: number };

/**
 * Drag-to-reveal before/after comparison, paired with an itemized CapEx
 * breakdown. No genuine before/after renovation pair exists in the client's
 * footage yet (Ramhan Villa was shot finished) — this uses two real photos
 * to demonstrate the mechanism, not to claim a real renovation. The
 * component itself works with real photos and real CapEx figures the
 * moment a client supplies a genuine case; callers must pass `isSample` so
 * the UI can label it honestly rather than let a placeholder read as fact.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  capex,
  rentIncreaseAed,
  isSample = false,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Omit entirely when the caller shows cost figures elsewhere (e.g. a
   * case study's metrics sidebar) — showing a "Total CapEx: AED 0" line
   * from an empty array would be worse than showing nothing. */
  capex?: CapexItem[];
  rentIncreaseAed?: number;
  isSample?: boolean;
}) {
  const [position, setPosition] = useState(50); // 0-100, % revealing "after"
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }

  const totalCapex = (capex ?? []).reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      {isSample && (
        <div className="mb-3 text-xs text-slate/50">
          Illustrative example — real before/after photos and costs pending
          a genuine renovation case.
        </div>
      )}

      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl shadow-card"
        onMouseDown={(e) => {
          dragging.current = true;
          updateFromClientX(e.clientX);
        }}
        onMouseMove={(e) => dragging.current && updateFromClientX(e.clientX)}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchStart={(e) => updateFromClientX(e.touches[0].clientX)}
        onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt={afterLabel}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Clipped with clip-path rather than a width-constrained wrapper,
            so it needs no read of the container's rendered size (which
            would be unavailable during SSR and on first paint). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />

        <div
          className="absolute inset-y-0 w-0.5 bg-white"
          style={{ left: `${position}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-card">
            <div className="h-3 w-3 rounded-full bg-slate/30" />
          </div>
        </div>

        <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
          {beforeLabel}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
          {afterLabel}
        </div>
      </div>

      {capex && capex.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {capex.map((item) => (
              <div
                key={item.label}
                className="flex items-baseline justify-between text-sm"
              >
                <span className="text-slate/70">{item.label}</span>
                <span className="font-medium tabular-nums text-slate">
                  AED {item.amount.toLocaleString("en-AE")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-slate/10 pt-3 text-sm">
            <span className="font-medium text-slate">Total CapEx</span>
            <span className="font-semibold tabular-nums text-slate">
              AED {totalCapex.toLocaleString("en-AE")}
            </span>
          </div>
          {rentIncreaseAed !== undefined && (
            <div className="mt-1 flex items-baseline justify-between text-sm">
              <span className="text-slate/70">Resulting rent increase</span>
              <span className="font-medium tabular-nums text-sovereign">
                +AED {rentIncreaseAed.toLocaleString("en-AE")}/mo
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
