"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/types";
import {
  calculateFees,
  calculateMilestoneSchedule,
  PAYMENT_STRUCTURES,
  totalInitialCapitalRequired,
  WADEEM_UAE_NATIONAL_REBATE_NOTE,
  type PaymentStructureId,
} from "@/lib/paymentPlan";
import { useCurrency } from "@/lib/currency-context";
import { DataRow } from "@/components/ui/DataRow";

const STRUCTURE_IDS = Object.keys(PAYMENT_STRUCTURES) as PaymentStructureId[];

export function PaymentPlanCalculator({
  priceAed,
  city,
  defaultStructureId = "60-40",
  glass = false,
  compact = false,
}: {
  priceAed: number;
  city: Property["city"];
  defaultStructureId?: PaymentStructureId;
  glass?: boolean;
  compact?: boolean;
}) {
  const { format } = useCurrency();
  const [structureId, setStructureId] = useState<PaymentStructureId>(defaultStructureId);

  const milestones = useMemo(
    () => calculateMilestoneSchedule(priceAed, structureId),
    [priceAed, structureId],
  );
  const fees = useMemo(() => calculateFees(priceAed, city), [priceAed, city]);
  const totalInitialCapitalAed = useMemo(
    () => totalInitialCapitalRequired(priceAed, city, structureId),
    [priceAed, city, structureId],
  );

  return (
    <div className={`min-w-0 overflow-hidden rounded-2xl border ${compact ? "p-4" : "p-6"} backdrop-blur-xl sm:p-8 ${glass
      ? "border-white/70 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_18px_45px_-28px_rgba(58,45,40,.55)]"
      : "border-transparent bg-canvas shadow-card"}`}>
      <div className="flex flex-wrap gap-2">
        {STRUCTURE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setStructureId(id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors sm:px-4 sm:py-2 sm:text-sm ${
              structureId === id ? "bg-royal text-white" : "bg-sand text-slate/70 hover:text-slate"
            }`}
          >
            {PAYMENT_STRUCTURES[id].name}
          </button>
        ))}
      </div>

      <div className={`mt-6 grid grid-cols-1 ${compact ? "gap-6" : "gap-10"} sm:grid-cols-2`}>
        <div>
          <h3 className="text-sm font-medium text-slate">Capital outlay schedule</h3>
          <ol className="mt-4 space-y-4 border-l border-slate/10 pl-5">
            {milestones.map((m, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[23px] top-1 h-2 w-2 rounded-full bg-royal" />
                <div className="text-sm text-slate/70">{m.label}</div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-lg font-semibold tabular-nums text-slate">
                    {format(m.amountAed)}
                  </span>
                  <span className="text-xs text-slate/50">{m.percentOfPrice}%</span>
                </div>
              </li>
            ))}
          </ol>
          {structureId === "wadeem-adib" && (
            <p className="mt-4 text-xs text-slate/50">{WADEEM_UAE_NATIONAL_REBATE_NOTE}</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate">Upfront fee transparency</h3>
          <div className="mt-4">
            <DataRow label={fees.transferFeeLabel} value={format(fees.transferFeeAed)} />
            <DataRow label="Transfer admin fee" value={format(fees.transferAdminFeeAed)} />
            <DataRow label="Agency fee (2%)" value={format(fees.agencyFeeAed)} />
            <DataRow label="VAT on agency fee (5%)" value={format(fees.agencyVatAed)} />
            <DataRow
              label="Trustee & registration fees"
              value={format(fees.trusteeRegistrationFeeAed)}
            />
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
          ? "Payment schedule quoted from the MODON sales pack. Upfront fees (transfer, agency, trustee) are illustrative typical-structure estimates, not published by MODON or the trustee — confirm exact terms per deal."
          : "Illustrative typical-structure estimates, not one specific developer's or trustee's published fees — confirm exact terms per deal."}
      </p>
    </div>
  );
}
