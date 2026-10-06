"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  calculateYieldStrategy,
  STRATEGY_DEFAULTS,
  type RentalStrategy,
} from "@/lib/yieldStrategy";
import { useCurrency } from "@/lib/currency-context";
import { RangeSlider } from "@/components/ui/RangeSlider";

function Output({ label, value, tone, compact }: { label: string; value: string; tone?: "positive"; compact?: boolean }) {
  return (
    <div>
      <div
        className={`${compact ? "text-base" : "text-lg"} font-semibold leading-none tabular-nums sm:text-2xl ${
          tone === "positive" ? "text-sovereign" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="mt-1.5 text-xs text-white/60">{label}</div>
    </div>
  );
}

export function YieldSimulator({ priceAed, sqft, glass = false, compact = false }: { priceAed: number; sqft: number; glass?: boolean; compact?: boolean }) {
  const { format } = useCurrency();
  const [strategy, setStrategy] = useState<RentalStrategy>("str");
  const [nightlyRateAed, setNightlyRateAed] = useState(1200);
  const [monthlyRentAed, setMonthlyRentAed] = useState(Math.round((priceAed * 0.06) / 12));
  const [occupancyPercent, setOccupancyPercent] = useState(STRATEGY_DEFAULTS.str.occupancyPercent);
  const [serviceChargePerSqftAed, setServiceChargePerSqftAed] = useState(18);
  const [managementFeePercent, setManagementFeePercent] = useState(
    STRATEGY_DEFAULTS.str.managementFeePercent,
  );
  const [dewaMonthlyAed, setDewaMonthlyAed] = useState(STRATEGY_DEFAULTS.str.dewaMonthlyAed);

  function switchStrategy(next: RentalStrategy) {
    setStrategy(next);
    const d = STRATEGY_DEFAULTS[next];
    setOccupancyPercent(d.occupancyPercent);
    setManagementFeePercent(d.managementFeePercent);
    setDewaMonthlyAed(d.dewaMonthlyAed);
  }

  const results = useMemo(
    () =>
      calculateYieldStrategy({
        priceAed,
        sqft,
        strategy,
        nightlyRateAed,
        monthlyRentAed,
        occupancyPercent,
        serviceChargePerSqftAed,
        managementFeePercent,
        dewaMonthlyAed,
      }),
    [
      priceAed,
      sqft,
      strategy,
      nightlyRateAed,
      monthlyRentAed,
      occupancyPercent,
      serviceChargePerSqftAed,
      managementFeePercent,
      dewaMonthlyAed,
    ],
  );

  const chartData = [
    {
      name: "Annual",
      "Service charge": Math.round(results.serviceChargeAnnualAed),
      "Management fee": Math.round(results.managementFeeAnnualAed),
      DEWA: Math.round(results.dewaAnnualAed),
      "Net cash flow": Math.round(results.netAnnualIncomeAed),
    },
  ];

  return (
    <div className={`min-w-0 overflow-hidden rounded-2xl border ${compact ? "p-4" : "p-6"} text-white backdrop-blur-xl sm:p-8 ${glass
      ? "border-white/20 bg-royal-deep/75 shadow-[inset_0_1px_0_rgba(255,255,255,.2),0_18px_45px_-28px_rgba(58,45,40,.65)]"
      : "border-transparent bg-royal-deep shadow-card"}`}>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => switchStrategy("str")}
          className={`rounded-full px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:py-2.5 sm:text-sm ${
            strategy === "str" ? "bg-white text-royal-deep" : "bg-white/10 text-white/70 hover:text-white"
          }`}
        >
          Short-term rental
        </button>
        <button
          type="button"
          onClick={() => switchStrategy("long-term")}
          className={`rounded-full px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:py-2.5 sm:text-sm ${
            strategy === "long-term"
              ? "bg-white text-royal-deep"
              : "bg-white/10 text-white/70 hover:text-white"
          }`}
        >
          Long-term lease
        </button>
      </div>

      <div className={`mt-5 grid grid-cols-1 ${compact ? "gap-4" : "gap-6"} sm:mt-8 sm:grid-cols-2 sm:gap-8`}>
        <div className={compact ? "space-y-4" : "space-y-6"}>
          {strategy === "str" ? (
            <RangeSlider
              label="Average nightly rate"
              value={nightlyRateAed}
              onChange={setNightlyRateAed}
              min={400}
              max={4000}
              step={50}
              displayValue={format(nightlyRateAed)}
              compact={compact}
            />
          ) : (
            <RangeSlider
              label="Monthly rent"
              value={monthlyRentAed}
              onChange={setMonthlyRentAed}
              min={Math.round(priceAed * 0.03 / 12)}
              max={Math.round(priceAed * 0.09 / 12)}
              step={500}
              displayValue={format(monthlyRentAed)}
              compact={compact}
            />
          )}
          <RangeSlider
            label="Occupancy rate"
            value={occupancyPercent}
            onChange={setOccupancyPercent}
            min={0}
            max={100}
            step={1}
            displayValue={`${occupancyPercent}%`}
            compact={compact}
          />
          <RangeSlider
            label="Building service charge"
            value={serviceChargePerSqftAed}
            onChange={setServiceChargePerSqftAed}
            min={5}
            max={40}
            step={1}
            displayValue={`${format(serviceChargePerSqftAed)}/sqft`}
            compact={compact}
          />
          <RangeSlider
            label="Property management fee"
            value={managementFeePercent}
            onChange={setManagementFeePercent}
            min={0}
            max={30}
            step={1}
            displayValue={`${managementFeePercent}%`}
            compact={compact}
          />
        </div>

        <div className={`grid grid-cols-2 gap-x-4 ${compact ? "gap-y-4 pt-4" : "gap-y-5 pt-5"} border-t border-white/10 sm:gap-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0`}>
          <Output compact={compact} label="Gross yield" value={`${results.grossYieldPercent.toFixed(1)}%`} />
          <Output
            compact={compact} label="Net yield"
            value={`${results.netYieldPercent.toFixed(1)}%`}
            tone={results.netYieldPercent >= 0 ? "positive" : undefined}
          />
          <Output compact={compact} label="Monthly cash flow" value={format(results.monthlyCashFlowAed)} />
          <Output compact={compact} label="Annual net take-home" value={format(results.netAnnualIncomeAed)} />
        </div>
      </div>

      <div className={`mt-5 min-w-0 w-full overflow-hidden ${compact ? "h-36 pt-4" : "h-44 pt-5"} border-t border-white/10 sm:mt-8 sm:h-56`}>
        <div className="mb-2 text-xs text-white/60">
          Gross income vs. operating expenses vs. net cash flow
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
            <XAxis
              type="number"
              stroke="rgba(255,255,255,0.4)"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
              tickFormatter={(v) => {
                const n = Number(v);
                if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
                if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
                return String(n);
              }}
            />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              formatter={(value) => format(Number(value))}
              contentStyle={{
                background: "var(--color-royal-deep)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "white",
                fontSize: 12,
                padding: "8px 12px",
              }}
              itemStyle={{ fontSize: 12, paddingTop: 2, paddingBottom: 2 }}
              labelStyle={{ fontSize: 12, fontWeight: 600 }}
              wrapperStyle={{ zIndex: 10 }}
            />
            {/* Sliders drive these values live — bars "spring" to their new
                height on every change rather than redrawing from zero, so
                dragging a slider reads as instant, not a reveal replaying. */}
            <Bar
              dataKey="Service charge"
              stackId="a"
              fill="rgba(255,255,255,0.35)"
              animationDuration={200}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="Management fee"
              stackId="a"
              fill="rgba(255,255,255,0.55)"
              animationDuration={200}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="DEWA"
              stackId="a"
              fill="rgba(255,255,255,0.75)"
              animationDuration={200}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="Net cash flow"
              stackId="a"
              fill="var(--color-sovereign)"
              radius={[0, 4, 4, 0]}
              animationDuration={200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
