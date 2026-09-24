"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/types";
import {
  calculateFees,
  calculateMilestoneSchedule,
  PAYMENT_STRUCTURES,
  totalInitialCapitalRequired,
  type PaymentStructureId,
} from "@/lib/paymentPlan";
import { useCurrency } from "@/lib/currency-context";

const STRUCTURE_IDS = Object.keys(PAYMENT_STRUCTURES) as PaymentStructureId[];

export function PaymentPlanCalculator({
  priceAed,
  city,
}: {
  priceAed: number;
  city: Property["city"];
}) {
  const { format } = useCurrency();
  const [structureId, setStructureId] = useState<PaymentStructureId>("60-40");

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
    <div className="rounded-2xl bg-canvas p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap gap-2">
        {STRUCTURE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setStructureId(id)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
              structureId === id ? "bg-royal text-white" : "bg-sand text-slate/70 hover:text-slate"
            }`}
          >
            {PAYMENT_STRUCTURES[id].name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2">
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
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate">Upfront fee transparency</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-baseline justify-between">
              <dt className="text-slate/70">{fees.transferFeeLabel}</dt>
              <dd className="tabular-nums text-slate">{format(fees.transferFeeAed)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate/70">Transfer admin fee</dt>
              <dd className="tabular-nums text-slate">{format(fees.transferAdminFeeAed)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate/70">Agency fee (2%)</dt>
              <dd className="tabular-nums text-slate">{format(fees.agencyFeeAed)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate/70">VAT on agency fee (5%)</dt>
              <dd className="tabular-nums text-slate">{format(fees.agencyVatAed)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate/70">Trustee &amp; registration fees</dt>
              <dd className="tabular-nums text-slate">
                {format(fees.trusteeRegistrationFeeAed)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl bg-royal-deep p-5 text-white">
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
        Illustrative typical-structure estimates, not one specific
        developer&apos;s or trustee&apos;s published fees — confirm exact
        terms per deal.
      </p>
    </div>
  );
}
