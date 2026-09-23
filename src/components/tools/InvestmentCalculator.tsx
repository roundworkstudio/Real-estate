"use client";

import { useMemo, useState } from "react";
import { calculate } from "@/lib/mortgage";

/**
 * Interactive pro forma / sensitivity simulator. All outputs are live
 * calculations from the sliders on screen — see lib/mortgage.ts. No IRR
 * (needs a hold-period/appreciation assumption not yet defined).
 */
function formatAed(n: number): string {
  return `AED ${Math.round(n).toLocaleString("en-AE")}`;
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  displayValue,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  displayValue: string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="font-medium tabular-nums text-white">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
      />
    </label>
  );
}

function Output({ label, value, tone }: { label: string; value: string; tone?: "positive" }) {
  return (
    <div>
      <div
        className={`text-2xl font-semibold tabular-nums sm:text-3xl ${
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
}: {
  priceAed: number;
  estimatedMonthlyRentAed: number;
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
    <div className="grid grid-cols-1 gap-8 rounded-2xl bg-royal-deep p-6 text-white shadow-card sm:grid-cols-2 sm:p-8">
      <div className="space-y-6">
        <Slider
          label="Down payment"
          value={downPaymentPercent}
          onChange={setDownPaymentPercent}
          min={10}
          max={100}
          step={5}
          displayValue={`${downPaymentPercent}%`}
        />
        <Slider
          label="Interest rate"
          value={interestRatePercent}
          onChange={setInterestRatePercent}
          min={2}
          max={8}
          step={0.1}
          displayValue={`${interestRatePercent.toFixed(1)}%`}
        />
        <Slider
          label="Vacancy rate"
          value={vacancyRatePercent}
          onChange={setVacancyRatePercent}
          min={0}
          max={20}
          step={1}
          displayValue={`${vacancyRatePercent}%`}
        />
        <Slider
          label="Monthly rent"
          value={monthlyRentAed}
          onChange={setMonthlyRentAed}
          min={Math.round(estimatedMonthlyRentAed * 0.5)}
          max={Math.round(estimatedMonthlyRentAed * 1.5)}
          step={500}
          displayValue={formatAed(monthlyRentAed)}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
        <Output label="Cap rate" value={`${results.capRatePercent.toFixed(1)}%`} tone="positive" />
        <Output
          label="Cash-on-cash return"
          value={`${results.cashOnCashReturnPercent.toFixed(1)}%`}
          tone={results.cashOnCashReturnPercent >= 0 ? "positive" : undefined}
        />
        <Output label="Monthly cash flow" value={formatAed(results.monthlyCashFlowAed)} />
        <Output label="Down payment" value={formatAed(results.downPaymentAed)} />
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
