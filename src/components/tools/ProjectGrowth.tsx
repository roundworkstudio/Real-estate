"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  calculateHoldAppreciation,
  SCENARIO_GROWTH_PERCENT,
  type HoldScenario,
} from "@/lib/holdAppreciation";
import type { Property } from "@/lib/types";
import { defaultLongTermNetAed } from "@/lib/project-rent";
import { useCurrency } from "@/lib/currency-context";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { InsightHeadline, InsightNote, Segmented } from "@/components/tools/ProjectInsightParts";

const HOLD_YEARS = [3, 5, 7, 10] as const;
type HoldYears = (typeof HOLD_YEARS)[number];

const SHORT_LABELS: Record<HoldScenario, string> = { conservative: "Low", base: "Mid", bull: "High" };

const SCENARIOS = (Object.keys(SCENARIO_GROWTH_PERCENT) as HoldScenario[]).map((s) => ({
  id: s,
  label: `${SHORT_LABELS[s]} · ${SCENARIO_GROWTH_PERCENT[s]}%`,
}));

const PRICE_GROWTH = "var(--color-royal)";
const RENT = "var(--color-sovereign)";

function axisAmount(v: number) {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}m`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}k`;
  return String(v);
}

/** What one home could be worth after a hold, and how much of that is
 * the buyer's own money coming back. `defaultEquityPercent` starts the
 * "your money in" slider at the share the project's plan actually asks
 * the buyer to fund. */
export function ProjectGrowth({
  home,
  handoverMonths,
  defaultEquityPercent = 20,
}: {
  home: Property;
  handoverMonths?: number;
  defaultEquityPercent?: number;
}) {
  const { format, formatCompact } = useCurrency();
  const priceAed = home.priceAed;
  const annualNetCashFlowAed = defaultLongTermNetAed(home);
  const rentStartsAfterYears = handoverMonths ? Math.ceil(handoverMonths / 12) : 0;
  const [scenario, setScenario] = useState<HoldScenario | "custom">("base");
  const [growthPercent, setGrowthPercent] = useState(SCENARIO_GROWTH_PERCENT.base);
  const [holdYears, setHoldYears] = useState<HoldYears>(5);
  const [equityPercent, setEquityPercent] = useState(defaultEquityPercent);

  const r = useMemo(
    () =>
      calculateHoldAppreciation({
        purchasePriceAed: priceAed,
        downPaymentPercent: equityPercent,
        annualGrowthPercent: growthPercent,
        holdYears,
        annualNetCashFlowAed,
        rentStartsAfterYears,
      }),
    [priceAed, equityPercent, growthPercent, holdYears, annualNetCashFlowAed, rentStartsAfterYears],
  );

  const chartData = r.series.map((p) => ({
    year: p.year === 0 ? "Today" : `Yr ${p.year}`,
    growth: Math.round(p.appreciationAed),
    rent: Math.round(p.cumulativeCashFlowAed),
  }));

  return (
    <div>
      <Segmented
        label="Yearly market growth"
        options={SCENARIOS}
        value={scenario}
        onChange={(s) => {
          setScenario(s);
          setGrowthPercent(SCENARIO_GROWTH_PERCENT[s as HoldScenario]);
        }}
      />

      <InsightHeadline
        value={formatCompact(r.projectedExitValueAed)}
        caption={`estimated value after ${holdYears} years, from ${formatCompact(priceAed)} today`}
        stats={[
          { label: "Your money in", value: formatCompact(r.initialEquityAed) },
          { label: "Gain to you", value: formatCompact(r.totalEquityCreatedAed) },
          { label: "Multiple", value: `${r.equityMultiple.toFixed(2)}x` },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div className="space-y-5">
          <RangeSlider
            label="Yearly price growth"
            value={growthPercent}
            onChange={(n) => {
              setGrowthPercent(n);
              setScenario("custom");
            }}
            min={0}
            max={12}
            step={0.5}
            displayValue={`${growthPercent.toFixed(1)}%`}
            tone="light"
          />
          <RangeSlider
            label="Your money in"
            value={equityPercent}
            onChange={setEquityPercent}
            min={5}
            max={100}
            step={5}
            displayValue={`${equityPercent}%`}
            tone="light"
          />
          <div>
            <p className="text-sm text-slate/60">Hold for</p>
            <div className="mt-2">
              <Segmented
                label="Hold period"
                options={HOLD_YEARS.map((y) => ({ id: String(y), label: `${y} yrs` }))}
                value={String(holdYears)}
                onChange={(y) => setHoldYears(Number(y) as HoldYears)}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3 className="text-sm font-medium text-slate">How the gain builds</h3>
            <div className="flex gap-4 text-xs text-slate/60">
              <span className="flex items-center gap-1.5">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: PRICE_GROWTH }} />
                Price growth
              </span>
              <span className="flex items-center gap-1.5">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: RENT }} />
                Rent collected
              </span>
            </div>
          </div>
          <div className="mt-4 h-56 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, left: 0, right: 4, bottom: 0 }}>
                <CartesianGrid stroke="rgb(46 36 32 / 0.07)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "rgb(46 36 32 / 0.5)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "rgb(46 36 32 / 0.5)" }}
                  tickFormatter={(v) => axisAmount(Number(v))}
                  width={40}
                />
                <Tooltip
                  formatter={(value, name) => [format(Number(value)), name === "growth" ? "Price growth" : "Rent collected"]}
                  contentStyle={{
                    background: "rgb(255 255 255 / 0.95)",
                    border: "1px solid rgb(46 36 32 / 0.08)",
                    borderRadius: 12,
                    fontSize: 12,
                    padding: "8px 12px",
                  }}
                  labelStyle={{ fontWeight: 600, color: "var(--color-slate)" }}
                />
                <Area
                  type="monotone"
                  dataKey="growth"
                  stackId="a"
                  stroke={PRICE_GROWTH}
                  strokeWidth={1.5}
                  fill={PRICE_GROWTH}
                  fillOpacity={0.22}
                  animationDuration={500}
                />
                <Area
                  type="monotone"
                  dataKey="rent"
                  stackId="a"
                  stroke={RENT}
                  strokeWidth={1.5}
                  fill={RENT}
                  fillOpacity={0.35}
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <InsightNote>
        Abu Dhabi villa values rose about 12% a year in 2025–26 (ValuStrat); these scenarios sit well below that,
        since growth usually slows over a longer hold. Rent is the rental yield tab&apos;s starting figure, about{" "}
        {formatCompact(annualNetCashFlowAed)} a year after costs,
        {rentStartsAfterYears > 0 ? ` from handover in year ${rentStartsAfterYears + 1},` : ""} held flat. Your money
        in is what you fund yourself. Excludes finance costs on any borrowed share, and selling costs.
      </InsightNote>
    </div>
  );
}
