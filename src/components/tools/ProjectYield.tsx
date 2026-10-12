"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/types";
import { calculateYieldStrategy, STRATEGY_DEFAULTS } from "@/lib/yieldStrategy";
import { defaultMonthlyRentAed, VILLA_GROSS_YIELD, VILLA_SERVICE_CHARGE_PER_SQFT_AED } from "@/lib/project-rent";
import { useCurrency } from "@/lib/currency-context";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { InsightHeadline, InsightNote, InsightTag, SplitBar } from "@/components/tools/ProjectInsightParts";

const LEASE = STRATEGY_DEFAULTS["long-term"];

/** Long-term rental yield for one home on a project page: what's left of
 * the rent after running costs, and where the rest goes. Starting figures
 * come from lib/project-rent.ts. */
export function ProjectYield({ home, handoverMonths }: { home: Property; handoverMonths?: number }) {
  const { format, formatCompact } = useCurrency();
  const [monthlyRentAed, setMonthlyRentAed] = useState(defaultMonthlyRentAed(home));
  const [occupancyPercent, setOccupancyPercent] = useState(LEASE.occupancyPercent);
  const [serviceChargePerSqftAed, setServiceChargePerSqftAed] = useState(VILLA_SERVICE_CHARGE_PER_SQFT_AED);
  const [managementFeePercent, setManagementFeePercent] = useState(LEASE.managementFeePercent);

  const r = useMemo(
    () =>
      calculateYieldStrategy({
        priceAed: home.priceAed,
        sqft: home.sqft,
        strategy: "long-term",
        nightlyRateAed: 0,
        monthlyRentAed,
        occupancyPercent,
        serviceChargePerSqftAed,
        managementFeePercent,
        dewaMonthlyAed: LEASE.dewaMonthlyAed,
      }),
    [home.priceAed, home.sqft, monthlyRentAed, occupancyPercent, serviceChargePerSqftAed, managementFeePercent],
  );

  const losing = r.netAnnualIncomeAed < 0;
  const rentStep = 500;

  return (
    <div>
      <InsightTag>
        Long-term lease{handoverMonths ? ` · rent from month ${handoverMonths}` : ""}
      </InsightTag>

      <InsightHeadline
        value={format(Math.abs(r.netAnnualIncomeAed))}
        caption={losing ? "a year out of pocket after running costs" : "a year to you, after running costs"}
        stats={[
          { label: "Net yield", value: `${r.netYieldPercent.toFixed(1)}%` },
          { label: "Gross yield", value: `${r.grossYieldPercent.toFixed(1)}%` },
          { label: "Per month", value: formatCompact(r.monthlyCashFlowAed) },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div className="space-y-5">
          <RangeSlider
            label="Monthly rent"
            value={monthlyRentAed}
            onChange={setMonthlyRentAed}
            min={Math.round((home.priceAed * 0.03) / 12 / rentStep) * rentStep}
            max={Math.round((home.priceAed * 0.07) / 12 / rentStep) * rentStep}
            step={rentStep}
            displayValue={format(monthlyRentAed)}
            tone="light"
          />
          <RangeSlider
            label="Time let each year"
            value={occupancyPercent}
            onChange={setOccupancyPercent}
            min={50}
            max={100}
            step={1}
            displayValue={`${occupancyPercent}%`}
            tone="light"
          />
          <RangeSlider
            label="Service charge"
            value={serviceChargePerSqftAed}
            onChange={setServiceChargePerSqftAed}
            min={3}
            max={35}
            step={0.5}
            displayValue={`${format(serviceChargePerSqftAed)}/sqft`}
            tone="light"
          />
          <RangeSlider
            label="Management fee"
            value={managementFeePercent}
            onChange={setManagementFeePercent}
            min={0}
            max={15}
            step={1}
            displayValue={`${managementFeePercent}%`}
            tone="light"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-sm font-medium text-slate">Where the rent goes</h3>
            <p className="whitespace-nowrap text-sm tabular-nums text-slate/60">{format(r.grossAnnualIncomeAed)} a year</p>
          </div>
          <div className="mt-4">
            <SplitBar
              segments={[
                {
                  label: `Service charge (${home.sqft.toLocaleString("en-AE")} sqft)`,
                  value: r.serviceChargeAnnualAed,
                  display: format(r.serviceChargeAnnualAed),
                  color: "rgb(46 36 32 / 0.55)",
                },
                { label: "Management fee", value: r.managementFeeAnnualAed, display: format(r.managementFeeAnnualAed), color: "rgb(46 36 32 / 0.28)" },
                { label: "To you", value: r.netAnnualIncomeAed, display: format(r.netAnnualIncomeAed), color: "var(--color-sovereign)", emphasis: true },
              ]}
            />
          </div>
        </div>
      </div>

      <InsightNote>
        {home.expectedAnnualRentAed
          ? "Starting rent is this listing's own estimate. "
          : `Starting rent is ${(VILLA_GROSS_YIELD * 100).toFixed(1)}% of the price a year, in line with Abu Dhabi premium villa yields (4.3–4.8%, Bayut and Sands of Wealth, 2026); this community has no completed homes to measure yet. Gross yield above allows for time unlet. `}
        Service charge starts at AED {VILLA_SERVICE_CHARGE_PER_SQFT_AED}/sqft, typical for Abu Dhabi villa communities; the
        developer sets the real figure. Tenant pays utilities. Before maintenance, mortgage and tax.
      </InsightNote>
    </div>
  );
}
