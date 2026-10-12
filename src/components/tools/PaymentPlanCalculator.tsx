"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/types";
import {
  calculateFees,
  calculateMilestoneSchedule,
  PAYMENT_STRUCTURES,
  PLAN_TIMELINES,
  totalInitialCapitalRequired,
  WADEEM_UAE_NATIONAL_REBATE_NOTE,
  type PaymentStructureId,
} from "@/lib/paymentPlan";
import { useCurrency } from "@/lib/currency-context";
import { DataRow } from "@/components/ui/DataRow";
import { InsightHeadline, InsightNote, InsightTag, PaymentSchedule, Segmented } from "@/components/tools/ProjectInsightParts";

const STRUCTURE_IDS = Object.keys(PAYMENT_STRUCTURES) as PaymentStructureId[];

export function PaymentPlanCalculator({
  priceAed,
  city,
  status,
  defaultStructureId = "60-40",
  glass = false,
  compact = false,
  bare = false,
  structureIds = STRUCTURE_IDS,
  scheduleLimit,
}: {
  priceAed: number;
  city: Property["city"];
  /** Off-plan drops the agency fee (the developer pays it) and, in
   * Dubai, the trustee fee. Omitted means a resale. */
  status?: Property["status"];
  defaultStructureId?: PaymentStructureId;
  glass?: boolean;
  compact?: boolean;
  /** No card of its own, for sitting directly in a page section. */
  bare?: boolean;
  /** Plans to offer; with one, its name shows instead of a picker. */
  structureIds?: PaymentStructureId[];
  /** Show this many payments, with the rest behind "Show all". */
  scheduleLimit?: number;
}) {
  const { format } = useCurrency();
  const [structureId, setStructureId] = useState<PaymentStructureId>(defaultStructureId);
  const [showAll, setShowAll] = useState(false);

  const milestones = useMemo(
    () => calculateMilestoneSchedule(priceAed, structureId),
    [priceAed, structureId],
  );
  const fees = useMemo(() => calculateFees(priceAed, city, status), [priceAed, city, status]);
  const totalInitialCapitalAed = useMemo(
    () => totalInitialCapitalRequired(priceAed, city, structureId, status),
    [priceAed, city, structureId, status],
  );

  const collapsed = scheduleLimit !== undefined && !showAll && milestones.length > scheduleLimit + 1;
  const visibleMilestones = collapsed ? milestones.slice(0, scheduleLimit) : milestones;
  const scheduleItems = visibleMilestones.map((m) => ({
    label: m.label,
    amount: format(m.amountAed),
    percent: m.percentOfPrice,
  }));

  const timeline = PLAN_TIMELINES[structureId];
  const youPercent = timeline?.segments.filter((s) => s.payer === "you").reduce((sum, s) => sum + s.percent, 0);
  const handover = milestones.find((m) => m.label.startsWith("Handover"));

  if (bare) {
    return (
      <div className="min-w-0">
        {structureIds.length === 1 ? (
          <InsightTag>{PAYMENT_STRUCTURES[structureIds[0]].name}</InsightTag>
        ) : (
          <Segmented
            label="Payment plan"
            options={structureIds.map((id) => ({ id, label: PAYMENT_STRUCTURES[id].name }))}
            value={structureId}
            onChange={setStructureId}
          />
        )}

        <InsightHeadline
          value={format(totalInitialCapitalAed)}
          caption="to secure it today, booking plus fees"
          stats={[
            { label: "Booking", value: `${milestones[0].percentOfPrice}%` },
            ...(timeline && youPercent !== undefined
              ? [
                  { label: "You fund", value: `${youPercent}% over ${timeline.youPayOver}` },
                  { label: `${timeline.financedBy} funds`, value: `${100 - youPercent}%` },
                ]
              : handover
                ? [{ label: "On handover", value: `${handover.percentOfPrice}%` }]
                : []),
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="text-sm font-medium text-slate">When you pay</h3>
            <PaymentSchedule
              items={scheduleItems}
              continues={collapsed}
              onShowAll={() => setShowAll(true)}
              totalCount={milestones.length}
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-sm font-medium text-slate">Fees on top</h3>
              <p className="whitespace-nowrap text-sm tabular-nums text-slate/60">{format(fees.totalUpfrontFeesAed)}</p>
            </div>
            <div className="mt-1">
              {fees.lines.map((l) => (
                <DataRow key={l.label} label={l.label} value={format(l.amountAed)} />
              ))}
              {status === "off-plan" && <DataRow label="Agency fee (paid by the developer)" value={format(0)} />}
            </div>
          </div>
        </div>

        <InsightNote>
          {structureId === "wadeem-adib"
            ? `${WADEEM_UAE_NATIONAL_REBATE_NOTE} Schedule quoted from the MODON sales pack. Fees use current ADREC/DARI rates; the SPA sets who pays the 2% registration fee, which is often split with the developer. Bank finance costs on the ADIB-funded share aren't included.`
            : "A typical plan with current government fee rates, not this developer's published schedule. Confirm exact terms per deal."}
        </InsightNote>
      </div>
    );
  }

  return (
    <div className={`min-w-0 overflow-hidden rounded-2xl border ${compact ? "p-4" : "p-6"} backdrop-blur-xl sm:p-8 ${glass
      ? "border-white/70 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_18px_45px_-28px_rgba(58,45,40,.55)]"
      : "border-transparent bg-canvas shadow-card"}`}>
      {structureIds.length === 1 ? (
        <p className="text-sm font-medium text-slate">{PAYMENT_STRUCTURES[structureIds[0]].name}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {structureIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setStructureId(id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                structureId === id ? "bg-royal-deep text-white" : "bg-sand text-slate/70 hover:text-slate"
              }`}
            >
              {PAYMENT_STRUCTURES[id].name}
            </button>
          ))}
        </div>
      )}

      <div className={`mt-6 grid grid-cols-1 ${compact ? "gap-6" : "gap-10"} sm:grid-cols-2`}>
        <div>
          <h3 className="text-sm font-medium text-slate">Capital outlay schedule</h3>
          <PaymentSchedule
            items={scheduleItems}
            continues={collapsed}
            onShowAll={() => setShowAll(true)}
            totalCount={milestones.length}
          />
          {structureId === "wadeem-adib" && (
            <p className="mt-4 text-xs text-slate/50">{WADEEM_UAE_NATIONAL_REBATE_NOTE}</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate">Upfront fee transparency</h3>
          <div className="mt-4">
            {fees.lines.map((l) => (
              <DataRow key={l.label} label={l.label} value={format(l.amountAed)} />
            ))}
          </div>

          <div className={`mt-6 rounded-2xl ${compact ? "p-4" : "p-5"} text-white ${glass ? "border border-white/20 bg-royal-deep/75 backdrop-blur-xl" : "bg-royal-deep"}`}>
            <div className="text-xs text-white/60">
              Total initial capital required to close (booking + upfront fees)
            </div>
            <div className="mt-1 text-3xl font-semibold tabular-nums">
              {format(totalInitialCapitalAed)}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-slate/40">
        {structureId === "wadeem-adib"
          ? "Payment schedule quoted from the MODON sales pack. Fees use current government rates; who pays the registration fee is set in the SPA. A guide, not a guarantee — confirm exact terms per deal."
          : "A guide using a typical plan and current government fee rates, not a guarantee — confirm exact terms per deal."}
      </p>
    </div>
  );
}
