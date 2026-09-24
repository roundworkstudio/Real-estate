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

export function YieldSimulator({ priceAed, sqft }: { priceAed: number; sqft: number }) {
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
    <div className="rounded-2xl bg-royal-deep p-6 text-white shadow-card sm:p-8">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => switchStrategy("str")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            strategy === "str" ? "bg-white text-royal-deep" : "bg-white/10 text-white/70 hover:text-white"
          }`}
        >
          Short-term rental
        </button>
        <button
          type="button"
          onClick={() => switchStrategy("long-term")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            strategy === "long-term"
              ? "bg-white text-royal-deep"
              : "bg-white/10 text-white/70 hover:text-white"
          }`}
        >
          Long-term lease
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          {strategy === "str" ? (
            <RangeSlider
              label="Average nightly rate"
              value={nightlyRateAed}
              onChange={setNightlyRateAed}
              min={400}
              max={4000}
              step={50}
              displayValue={format(nightlyRateAed)}
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
          />
          <RangeSlider
            label="Building service charge"
            value={serviceChargePerSqftAed}
            onChange={setServiceChargePerSqftAed}
            min={5}
            max={40}
            step={1}
            displayValue={`${format(serviceChargePerSqftAed)}/sqft`}
          />
          <RangeSlider
            label="Property management fee"
            value={managementFeePercent}
            onChange={setManagementFeePercent}
            min={0}
            max={30}
            step={1}
            displayValue={`${managementFeePercent}%`}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          <Output label="Gross yield" value={`${results.grossYieldPercent.toFixed(1)}%`} />
          <Output
            label="Net yield"
            value={`${results.netYieldPercent.toFixed(1)}%`}
            tone={results.netYieldPercent >= 0 ? "positive" : undefined}
          />
          <Output label="Monthly cash flow" value={format(results.monthlyCashFlowAed)} />
          <Output label="Annual net take-home" value={format(results.netAnnualIncomeAed)} />
        </div>
      </div>

      <div className="mt-8 h-56 border-t border-white/10 pt-6">
        <div className="mb-2 text-xs text-white/60">
          Gross income vs. operating expenses vs. net cash flow
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
            <XAxis
              type="number"
              stroke="rgba(255,255,255,0.4)"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
              tickFormatter={(v) => format(v)}
            />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              formatter={(value) => format(Number(value))}
              contentStyle={{
                background: "var(--color-royal-deep)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "white",
              }}
            />
            <Bar dataKey="Service charge" stackId="a" fill="rgba(255,255,255,0.35)" />
            <Bar dataKey="Management fee" stackId="a" fill="rgba(255,255,255,0.55)" />
            <Bar dataKey="DEWA" stackId="a" fill="rgba(255,255,255,0.75)" />
            <Bar
              dataKey="Net cash flow"
              stackId="a"
              fill="var(--color-sovereign)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
