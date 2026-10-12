"use client";

/**
 * The project page's calculators, one at a time: payment plan first (what
 * an off-plan buyer asks before anything else), rental yield and five-year
 * growth behind tabs. Runs against the home picked in the Homes section
 * (shared through SelectedUnitProvider), so every figure is for a real
 * listing and the unit choice lives in one place.
 */
import { useState } from "react";
import type { Property } from "@/lib/types";
import { ProjectYield } from "@/components/tools/ProjectYield";
import { ProjectGrowth } from "@/components/tools/ProjectGrowth";
import { PaymentPlanCalculator } from "@/components/tools/PaymentPlanCalculator";
import { CurrencySwitcher } from "@/components/tools/CurrencySwitcher";
import { FormattedPrice } from "@/components/ui/FormattedPrice";
import { useSelectedUnit } from "@/components/ui/SelectedUnit";
import { PLAN_TIMELINES, type PaymentStructureId } from "@/lib/paymentPlan";
import { unitLabel } from "@/lib/project-facts";

const TOOLS = [
  { id: "plan", label: "Payment plan" },
  { id: "yield", label: "Rental yield" },
  { id: "growth", label: "5-year growth" },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

export function DevelopmentAnalytics({
  properties,
  defaultPaymentStructureId,
  paymentStructureIds,
  handoverMonths,
}: {
  properties: Property[];
  defaultPaymentStructureId?: PaymentStructureId;
  paymentStructureIds?: PaymentStructureId[];
  handoverMonths?: number;
}) {
  const sorted = [...properties].sort((a, b) => a.priceAed - b.priceAed);
  const { home: property } = useSelectedUnit(sorted);
  const [tool, setTool] = useState<ToolId>("plan");
  const rentDelayMonths = property.status === "off-plan" ? handoverMonths : undefined;
  const ownSharePercent = defaultPaymentStructureId
    ? PLAN_TIMELINES[defaultPaymentStructureId]?.segments
        .filter((s) => s.payer === "you")
        .reduce((sum, s) => sum + s.percent, 0)
    : undefined;

  return (
    <div className="liquid-glass-light rounded-[1.75rem] px-4 py-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate/70">
          Figures for the <span className="font-medium text-slate">{unitLabel(property, sorted)}</span> at{" "}
          <span className="whitespace-nowrap font-medium text-slate">
            <FormattedPrice amountAed={property.priceAed} />
          </span>
          {sorted.length > 1 && (
            <>
              {" · "}
              <a href="#homes" className="text-royal underline-offset-4 hover:underline">
                Change home
              </a>
            </>
          )}
        </p>
        <CurrencySwitcher />
      </div>

      <div role="tablist" aria-label="Calculator" className="mt-6 flex gap-5 border-b border-slate/10 sm:gap-6">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tool === t.id}
            onClick={() => setTool(t.id)}
            className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-[13px] font-medium sm:text-sm transition-colors ${
              tool === t.id ? "border-slate text-slate" : "border-transparent text-slate/55 hover:text-slate"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-8">
        {tool === "plan" && (
          <PaymentPlanCalculator
            key={property.slug}
            priceAed={property.priceAed}
            city={property.city}
            status={property.status}
            defaultStructureId={defaultPaymentStructureId}
            structureIds={paymentStructureIds}
            scheduleLimit={3}
            bare
          />
        )}
        {tool === "yield" && <ProjectYield key={property.slug} home={property} handoverMonths={rentDelayMonths} />}
        {tool === "growth" && (
          <ProjectGrowth
            key={property.slug}
            home={property}
            handoverMonths={rentDelayMonths}
            defaultEquityPercent={ownSharePercent}
          />
        )}
      </div>

      <p className="mt-8 border-t border-slate/10 pt-5 text-xs leading-relaxed text-slate/55">
        These figures are guides based on recent market trends and the developer&apos;s published plan. They aren&apos;t
        guaranteed; confirm exact terms with Janvi before you commit.
      </p>
    </div>
  );
}
