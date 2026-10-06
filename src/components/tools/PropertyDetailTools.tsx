"use client";

import { useState } from "react";
import { CurrencyProvider } from "@/lib/currency-context";
import type { Property } from "@/lib/types";
import type { PaymentStructureId } from "@/lib/paymentPlan";
import { InvestmentCalculator } from "@/components/tools/InvestmentCalculator";
import { YieldSimulator } from "@/components/tools/YieldSimulator";
import { HoldAppreciationModel } from "@/components/tools/HoldAppreciationModel";
import { PaymentPlanCalculator } from "@/components/tools/PaymentPlanCalculator";

const TABS = [
  "About",
  "Investment analysis",
  "Yield strategy simulator",
  "5 year hold & appreciation",
  "Payment plan & fee transparency",
] as const;

type PropertyDetailToolsProps = {
  priceAed: number;
  sqft: number;
  estimatedMonthlyRent: number;
  estimatedAnnualNetCashFlow: number;
  city: Property["city"];
  paymentStructureId: PaymentStructureId;
};

export function PropertyDetailTools({
  priceAed,
  sqft,
  estimatedMonthlyRent,
  estimatedAnnualNetCashFlow,
  city,
  paymentStructureId,
}: PropertyDetailToolsProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("About");

  return (
    <CurrencyProvider>
      <section id="property-tools" className="hidden py-10 md:block">
        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-6 py-3 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-white/30 bg-royal-deep/80 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.28),0_8px_24px_-16px_rgba(58,45,40,.65)] backdrop-blur-xl hover:bg-royal-deep/90"
                  : "border-white/70 bg-white/35 text-slate shadow-[inset_0_1px_0_rgba(255,255,255,.65),0_8px_24px_-16px_rgba(58,45,40,.45)] backdrop-blur-xl hover:bg-white/55"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-5 min-w-0 rounded-[1.75rem] border border-white/80 bg-white/60 p-4 shadow-[0_18px_45px_-35px_rgba(58,45,40,.45)] backdrop-blur-md">
          {activeTab === "About" && (
            <div className="max-w-3xl">
              <h3 className="text-2xl font-semibold text-slate">About this property</h3>
              <p className="mt-5 text-lg leading-8 text-slate/70">
                Placeholder description text standing in for the agent&apos;s own words — three or four sentences covering the property, the building, and what makes it worth viewing, at roughly the length the real copy is expected to run.
              </p>
            </div>
          )}

          {activeTab === "Investment analysis" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-slate">Investment analysis</h3>
                <p className="mt-3 text-base text-slate/60">Adjust the assumptions — every figure below recalculates live.</p>
              </div>
              <InvestmentCalculator priceAed={priceAed} estimatedMonthlyRentAed={estimatedMonthlyRent} />
            </div>
          )}

          {activeTab === "Yield strategy simulator" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-slate">Yield strategy simulator</h3>
                <p className="mt-3 text-base text-slate/60">Compare a short-term holiday let against a standard long-term lease.</p>
              </div>
              <YieldSimulator priceAed={priceAed} sqft={sqft} />
            </div>
          )}

          {activeTab === "5 year hold & appreciation" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-slate">5-year hold &amp; appreciation</h3>
                <p className="mt-3 text-base text-slate/60">Project equity growth over a hold period under a market scenario.</p>
              </div>
              <HoldAppreciationModel purchasePriceAed={priceAed} annualNetCashFlowAed={estimatedAnnualNetCashFlow} />
            </div>
          )}

          {activeTab === "Payment plan & fee transparency" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-slate">Payment plan &amp; fee transparency</h3>
                <p className="mt-3 text-base text-slate/60">Review capital outlay by milestone and the upfront fees due at closing.</p>
              </div>
              <PaymentPlanCalculator priceAed={priceAed} city={city} defaultStructureId={paymentStructureId} />
            </div>
          )}
        </div>
      </section>
    </CurrencyProvider>
  );
}
