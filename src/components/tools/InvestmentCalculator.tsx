"use client";

import { useMemo, useState } from "react";
import { calculate } from "@/lib/mortgage";
import { RangeSlider } from "@/components/ui/RangeSlider";

/**
 * Interactive pro forma / sensitivity simulator. All outputs are live
 * calculations from the sliders on screen — see lib/mortgage.ts. No IRR
 * (needs a hold-period/appreciation assumption not yet defined).
 */
function formatAed(n: number): string {
  return `AED ${Math.round(n).toLocaleString("en-AE")}`;
}

function Output({ label, value, tone, compact }: { label: string; value: string; tone?: "positive"; compact?: boolean }) {
  return (
    <div>
      <div
        className={`${compact ? "text-xl" : "text-2xl"} font-semibold tabular-nums sm:text-3xl ${
          tone === "positive" ? "text-sovereign" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-white/60">{label}</div>
    </div>
  );
}

export function InvestmentCalculator({
  priceAed,
  estimatedMonthlyRentAed,
  glass = false,
  compact = false,
}: {
  priceAed: number;
  estimatedMonthlyRentAed: number;
  glass?: boolean;
  compact?: boolean;
}) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRatePercent, setInterestRatePercent] = useState(4.5);
  const [vacancyRatePercent, setVacancyRatePercent] = useState(5);
  const [monthlyRentAed, setMonthlyRentAed] = useState(estimatedMonthlyRentAed);

  const results = useMemo(
    () =>
      calculate({
        priceAed,
        downPaymentPercent,
        interestRatePercent,
        vacancyRatePercent,
        monthlyRentAed,
      }),
    [priceAed, downPaymentPercent, interestRatePercent, vacancyRatePercent, monthlyRentAed],
  );

  return (
    <div className={`min-w-0 overflow-hidden grid grid-cols-1 ${compact ? "gap-5 p-4" : "gap-8 p-6"} rounded-2xl border text-white backdrop-blur-xl sm:grid-cols-2 sm:p-8 ${glass
      ? "border-white/20 bg-royal-deep/75 shadow-[inset_0_1px_0_rgba(255,255,255,.2),0_18px_45px_-28px_rgba(58,45,40,.65)]"
      : "border-transparent bg-royal-deep shadow-card"}`}>
      <div className={compact ? "space-y-4" : "space-y-6"}>
        <RangeSlider
          label="Down payment"
          value={downPaymentPercent}
          onChange={setDownPaymentPercent}
          min={10}
          max={100}
          step={5}
          displayValue={`${downPaymentPercent}%`}
          tone="dark"
          compact={compact}
        />
        <RangeSlider
          label="Interest rate"
          value={interestRatePercent}
          onChange={setInterestRatePercent}
          min={2}
          max={8}
          step={0.1}
          displayValue={`${interestRatePercent.toFixed(1)}%`}
          tone="dark"
          compact={compact}
        />
        <RangeSlider
          label="Vacancy rate"
          value={vacancyRatePercent}
          onChange={setVacancyRatePercent}
          min={0}
          max={20}
          step={1}
          displayValue={`${vacancyRatePercent}%`}
          tone="dark"
          compact={compact}
        />
        <RangeSlider
          label="Monthly rent"
          value={monthlyRentAed}
          onChange={setMonthlyRentAed}
          min={Math.round(estimatedMonthlyRentAed * 0.5)}
          max={Math.round(estimatedMonthlyRentAed * 1.5)}
          step={500}
          displayValue={formatAed(monthlyRentAed)}
          tone="dark"
          compact={compact}
        />
      </div>

      <div className={`grid grid-cols-2 ${compact ? "gap-4 pt-4" : "gap-6 pt-6"} border-t border-white/10 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0`}>
        <Output compact={compact} label="Cap rate" value={`${results.capRatePercent.toFixed(1)}%`} tone="positive" />
        <Output
          compact={compact}
          label="Cash-on-cash return"
          value={`${results.cashOnCashReturnPercent.toFixed(1)}%`}
          tone={results.cashOnCashReturnPercent >= 0 ? "positive" : undefined}
        />
        <Output compact={compact} label="Monthly cash flow" value={formatAed(results.monthlyCashFlowAed)} />
        <Output compact={compact} label="Down payment" value={formatAed(results.downPaymentAed)} />
        <div className="col-span-2 text-xs text-white/40">
          25-year amortizing mortgage assumed. Net operating income equals
          rent after vacancy — service charges and other running costs
          aren&apos;t modelled yet, pending per-listing figures from the
          agent (see docs/property-page-spec.md).
        </div>
      </div>
    </div>
  );
}
