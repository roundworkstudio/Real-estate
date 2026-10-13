"use client";

/**
 * What it costs to buy, Abu Dhabi beside Dubai. The rules are written out;
 * the totals come from calculateFees so they always match the calculators.
 */
import { useState } from "react";
import { calculateFees } from "@/lib/paymentPlan";
import { Segmented } from "@/components/tools/ProjectInsightParts";
import { FormattedPrice } from "@/components/ui/FormattedPrice";

const EXAMPLE_PRICE_AED = 8_700_000;

type Purchase = "off-plan" | "ready";

const ROWS: { label: string; abuDhabi: string; dubai: string }[] = [
  { label: "Registration", abuDhabi: "2% of the price, often split with the seller", dubai: "4% of the price" },
  { label: "Admin fee", abuDhabi: "AED 450 + VAT (DARI)", dubai: "AED 580 (DLD)" },
  { label: "Trustee office", abuDhabi: "None", dubai: "AED 4,000 + VAT on ready homes" },
  {
    label: "Agency fee",
    abuDhabi: "2% + VAT, capped at AED 500,000. None off-plan from the developer",
    dubai: "2% + VAT. None off-plan from the developer",
  },
];

export function BuyingCosts() {
  const [purchase, setPurchase] = useState<Purchase>("off-plan");
  const status = purchase === "off-plan" ? "off-plan" : "new";
  const abuDhabi = calculateFees(EXAMPLE_PRICE_AED, "Abu Dhabi", status).totalUpfrontFeesAed;
  const dubai = calculateFees(EXAMPLE_PRICE_AED, "Dubai", status).totalUpfrontFeesAed;

  return (
    <div className="liquid-glass-light rounded-[1.75rem] px-4 py-5 sm:p-8">
      <div role="table" aria-label="Buying fees, Abu Dhabi and Dubai" className="text-sm">
        <div role="row" className="grid grid-cols-2 gap-x-4 border-b border-slate/10 pb-3 text-xs font-medium uppercase tracking-[0.12em] text-slate/50 sm:grid-cols-[10rem_1fr_1fr]">
          <span role="columnheader" className="sr-only sm:not-sr-only">
            <span className="sr-only">Fee</span>
          </span>
          <span role="columnheader" className="text-royal">Abu Dhabi</span>
          <span role="columnheader">Dubai</span>
        </div>
        {ROWS.map((row) => (
          <div
            key={row.label}
            role="row"
            className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-b border-slate/10 py-4 last:border-0 sm:grid-cols-[10rem_1fr_1fr]"
          >
            <span role="rowheader" className="col-span-2 font-medium text-slate sm:col-span-1">{row.label}</span>
            <span role="cell" className="leading-relaxed text-slate/75">{row.abuDhabi}</span>
            <span role="cell" className="leading-relaxed text-slate/75">{row.dubai}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[1.25rem] bg-slate/[0.04] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate/70">
            Fees on an <span className="whitespace-nowrap font-medium text-slate"><FormattedPrice amountAed={EXAMPLE_PRICE_AED} /></span> villa
          </p>
          <Segmented<Purchase>
            label="Type of purchase"
            options={[
              { id: "off-plan", label: "Off-plan" },
              { id: "ready", label: "Ready" },
            ]}
            value={purchase}
            onChange={setPurchase}
          />
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs text-slate/55">Abu Dhabi</dt>
            <dd className="mt-1 whitespace-nowrap text-lg font-semibold text-slate sm:text-2xl">
              <FormattedPrice amountAed={abuDhabi} compact={false} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate/55">Dubai</dt>
            <dd className="mt-1 whitespace-nowrap text-lg font-semibold text-slate/60 sm:text-2xl">
              <FormattedPrice amountAed={dubai} compact={false} />
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-slate/55">
          Assumes the buyer pays the full registration fee. Mortgage registration and bank fees are extra if you
          finance.
        </p>
      </div>
    </div>
  );
}
