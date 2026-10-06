"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  calculateHoldAppreciation,
  SCENARIO_GROWTH_PERCENT,
  SCENARIO_LABELS,
  type HoldScenario,
} from "@/lib/holdAppreciation";
import { useCurrency } from "@/lib/currency-context";
import { RangeSlider } from "@/components/ui/RangeSlider";

const HOLD_YEAR_OPTIONS = [3, 5, 7, 10] as const;

function Output({ label, value, compact }: { label: string; value: string; compact?: boolean }) {
  return (
    <div>
      <div className={`${compact ? "text-base" : "text-lg"} font-semibold leading-none tabular-nums text-slate sm:text-2xl`}>{value}</div>
      <div className="mt-1.5 text-xs text-slate/60">{label}</div>
    </div>
  );
}

export function HoldAppreciationModel({
  purchasePriceAed,
  glass = false,
  compact = false,
  /** Net annual rental income used as the flat cash-flow assumption — see
   * lib/holdAppreciation.ts's top comment on why this is unlevered. */
  annualNetCashFlowAed,
}: {
  purchasePriceAed: number;
  annualNetCashFlowAed: number;
  glass?: boolean;
  compact?: boolean;
}) {
  const { format } = useCurrency();
  const [scenario, setScenario] = useState<HoldScenario>("base");
  const [annualGrowthPercent, setAnnualGrowthPercent] = useState(SCENARIO_GROWTH_PERCENT.base);
  const [holdYears, setHoldYears] = useState<(typeof HOLD_YEAR_OPTIONS)[number]>(5);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);

  function selectScenario(next: HoldScenario) {
    setScenario(next);
    setAnnualGrowthPercent(SCENARIO_GROWTH_PERCENT[next]);
  }

  const results = useMemo(
    () =>
      calculateHoldAppreciation({
        purchasePriceAed,
        downPaymentPercent,
        annualGrowthPercent,
        holdYears,
        annualNetCashFlowAed,
      }),
    [purchasePriceAed, downPaymentPercent, annualGrowthPercent, holdYears, annualNetCashFlowAed],
  );

  const chartData = results.series.map((p) => ({
    year: `Year ${p.year}`,
    Appreciation: Math.round(p.appreciationAed),
    "Cumulative cash flow": Math.round(p.cumulativeCashFlowAed),
  }));

  return (
    <div className={`min-w-0 overflow-hidden rounded-2xl border ${compact ? "p-4" : "p-6"} backdrop-blur-xl sm:p-8 ${glass
      ? "border-white/70 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_18px_45px_-28px_rgba(58,45,40,.55)]"
      : "border-transparent bg-canvas shadow-card"}`}>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(SCENARIO_GROWTH_PERCENT) as HoldScenario[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => selectScenario(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
              scenario === s ? "bg-royal text-white" : "bg-sand text-slate/70 hover:text-slate"
            }`}
          >
            {SCENARIO_LABELS[s]} · {SCENARIO_GROWTH_PERCENT[s]}%/yr
          </button>
        ))}
      </div>

      <div className={`mt-5 grid grid-cols-1 ${compact ? "gap-4" : "gap-6"} sm:mt-8 sm:grid-cols-2 sm:gap-8`}>
        <div className={compact ? "space-y-4" : "space-y-6"}>
          <RangeSlider
            label="Expected annual market growth"
            value={annualGrowthPercent}
            onChange={(n) => {
              setAnnualGrowthPercent(n);
              setScenario("base"); // manual adjustment leaves scenario presets behind
            }}
            min={0}
            max={12}
            step={0.5}
            displayValue={`${annualGrowthPercent.toFixed(1)}%`}
            tone="light"
            compact={compact}
          />
          <RangeSlider
            label="Down payment (invested equity)"
            value={downPaymentPercent}
            onChange={setDownPaymentPercent}
            min={10}
            max={100}
            step={5}
            displayValue={`${downPaymentPercent}%`}
            tone="light"
            compact={compact}
          />
          <div className="block">
            <div className="text-sm text-slate/60">Hold period</div>
            <div className="mt-2 flex gap-2">
              {HOLD_YEAR_OPTIONS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setHoldYears(y)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
                    holdYears === y ? "bg-royal text-white" : "bg-sand text-slate/70 hover:text-slate"
                  }`}
                >
                  {y} yrs
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-x-4 ${compact ? "gap-y-4 pt-4" : "gap-y-5 pt-5"} border-t border-slate/10 sm:gap-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0`}>
          <Output compact={compact} label="Projected exit value" value={format(results.projectedExitValueAed)} />
          <Output compact={compact} label="Total equity created" value={format(results.totalEquityCreatedAed)} />
          <Output compact={compact}
            label="Net IRR"
            value={results.netIRRPercent === null ? "n/a" : `${results.netIRRPercent.toFixed(1)}%`}
          />
          <Output compact={compact} label="Equity multiple" value={`${results.equityMultiple.toFixed(2)}x`} />
        </div>
      </div>

      <div className={`mt-5 min-w-0 w-full overflow-hidden ${compact ? "h-40 pt-4" : "h-48 pt-5"} border-t border-slate/10 sm:mt-8 sm:h-64`}>
        <div className="mb-2 text-xs text-slate/60">
          Cumulative cash flow stacked on asset appreciation, {holdYears}-year hold
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: 2, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,34,0.08)" vertical={false} />
            <XAxis dataKey="year" stroke="rgba(30,41,34,0.4)" tick={{ fontSize: 10 }} />
            <YAxis
              stroke="rgba(30,41,34,0.4)"
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => {
                const n = Number(v);
                if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
                if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
                return String(n);
              }}
              width={36}
            />
            <Tooltip
              formatter={(value) => format(Number(value))}
              contentStyle={{
                background: "var(--color-canvas)",
                border: "1px solid rgba(30,41,34,0.1)",
                borderRadius: 8,
                fontSize: 12,
                padding: "8px 12px",
              }}
              itemStyle={{ fontSize: 12, paddingTop: 2, paddingBottom: 2 }}
              labelStyle={{ fontSize: 12, fontWeight: 600 }}
            />
            {/* Draws itself left to right on first reveal (Recharts'
                default mount animation); redraws faster on input change so
                dragging the growth/down-payment sliders stays responsive. */}
            <Area
              type="monotone"
              dataKey="Appreciation"
              stackId="a"
              stroke="var(--color-royal)"
              fill="var(--color-royal)"
              fillOpacity={0.25}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="Cumulative cash flow"
              stackId="a"
              stroke="var(--color-sovereign)"
              fill="var(--color-sovereign)"
              fillOpacity={0.35}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-6 text-xs text-slate/40">
        Simplified model: uses the down payment as invested equity and an
        unlevered net rental cash flow held flat across the period, not
        adjusted for mortgage debt service. For a debt-serviced monthly cash
        flow at today&apos;s terms, see the investment analysis calculator
        above.
      </p>
    </div>
  );
}
