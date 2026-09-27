"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

export type MarketCardOutcome = {
  id: string;
  label: string;
  /** Formatted display value, e.g. "1,854 AED/sqft" or "3 listings". */
  value: string;
  /** 0–100, drives the fill bar's width — a real proportion (unit count,
   * price share, etc.), not a probability. */
  sharePercent: number;
  tone?: "royal" | "sovereign";
};

/**
 * Adapted from beui.dev's "Prediction Market" card (2026-09-27, explicit
 * request — "add market/insights/etc. using this style", pointing at
 * `npx shadcn add @beui/prediction-market-card`) — kept the shell that
 * generalises: an eyebrow category + status row, a title, a stack of
 * "outcome" rows each with a value and a proportional animated fill bar,
 * and a footer metadata line. Dropped what's specific to betting markets
 * (bookmarking, buy/sell CTAs, live odds) since there's nothing here to
 * bet on.
 *
 * The "outcomes" are never invented sentiment or a price-direction
 * forecast — directives/anti-slop-ui.md's real-data rule rules that out
 * outright. Every caller feeds this real, derived counts/averages from
 * `sampleProperties` (e.g. "3 of 5 sample listings are in Wadeem
 * Gardens"), computed at render time so the bars can't drift out of sync
 * with the data — see InsightsPage's own note on how it's used.
 */
export function MarketCard({
  icon: Icon,
  category,
  title,
  status,
  volume,
  outcomes,
}: {
  icon: LucideIcon;
  category: string;
  title: string;
  status: string;
  volume: string;
  outcomes: MarketCardOutcome[];
}) {
  return (
    <div className="rounded-2xl border border-slate/10 bg-canvas p-6 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-slate/40 uppercase">
          <Icon size={14} />
          {category}
        </div>
        <div className="text-xs text-slate/40">{status}</div>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate">{title}</h3>

      <div className="mt-5 space-y-3">
        {outcomes.map((o) => (
          <div key={o.id}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-slate">{o.label}</span>
              <span className="tabular-nums text-slate/60">{o.value}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate/10">
              <motion.div
                className={`h-full rounded-full ${o.tone === "sovereign" ? "bg-sovereign" : "bg-royal"}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${o.sharePercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-slate/10 pt-4 text-xs text-slate/40">
        {volume}
      </div>
    </div>
  );
}
