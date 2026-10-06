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
  title: string;
  community: string;
  status: Property["status"];
  priceDisplay: string;
  estimatedMonthlyRent: number;
  estimatedAnnualNetCashFlow: number;
  city: Property["city"];
  paymentStructureId: PaymentStructureId;
};

export function PropertyDetailTools({
  priceAed,
  sqft,
  title,
  community,
  status,
  priceDisplay,
  estimatedMonthlyRent,
  estimatedAnnualNetCashFlow,
  city,
  paymentStructureId,
}: PropertyDetailToolsProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("About");

  return (
    <CurrencyProvider>
      <section className="hidden border-t border-slate/10 py-12 md:block lg:py-16">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate/45">Property insights</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate">Understand the opportunity</h2>
          </div>
          <p className="max-w-xs text-right text-sm leading-relaxed text-slate/55">
            Explore the property, then model the numbers with the same tools available on mobile.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 rounded-[1.75rem] border border-white/70 bg-white/35 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_18px_45px_-30px_rgba(58,45,40,.5)] backdrop-blur-xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-royal-deep text-white shadow-[inset_0_1px_0_rgba(255,255,255,.2),0_8px_18px_-12px_rgba(58,45,40,.7)]"
                  : "text-slate/70 hover:bg-white/60 hover:text-slate"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-8 min-w-0 rounded-[2rem] border border-white/70 bg-white/35 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_24px_60px_-38px_rgba(58,45,40,.55)] backdrop-blur-xl lg:p-8">
          {activeTab === "About" && (
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate/45">About this property</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate">{title}</h3>
              <p className="mt-4 text-base leading-8 text-slate/70">
                Placeholder description text standing in for the agent&apos;s own words — three or four sentences covering the property, the building, and what makes it worth viewing, at roughly the length the real copy is expected to run.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate/60">
                <span className="rounded-full bg-white/55 px-4 py-2">Guide price · {priceDisplay}</span>
                <span className="rounded-full bg-white/55 px-4 py-2">{community} · {status}</span>
              </div>
            </div>
          )}

          {activeTab === "Investment analysis" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-slate">Investment analysis</h3>
                <p className="mt-2 text-sm text-slate/60">Adjust the assumptions — every figure below recalculates live.</p>
              </div>
              <InvestmentCalculator priceAed={priceAed} estimatedMonthlyRentAed={estimatedMonthlyRent} />
            </div>
          )}

          {activeTab === "Yield strategy simulator" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-slate">Yield strategy simulator</h3>
                <p className="mt-2 text-sm text-slate/60">Compare a short-term holiday let against a standard long-term lease.</p>
              </div>
              <YieldSimulator priceAed={priceAed} sqft={sqft} />
            </div>
          )}

          {activeTab === "5 year hold & appreciation" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-slate">5-year hold &amp; appreciation</h3>
                <p className="mt-2 text-sm text-slate/60">Project equity growth over a hold period under a market scenario.</p>
              </div>
              <HoldAppreciationModel purchasePriceAed={priceAed} annualNetCashFlowAed={estimatedAnnualNetCashFlow} />
            </div>
          )}

          {activeTab === "Payment plan & fee transparency" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-slate">Payment plan &amp; fee transparency</h3>
                <p className="mt-2 text-sm text-slate/60">Review capital outlay by milestone and the upfront fees due at closing.</p>
              </div>
              <PaymentPlanCalculator priceAed={priceAed} city={city} defaultStructureId={paymentStructureId} />
            </div>
          )}
        </div>
      </section>
    </CurrencyProvider>
  );
}
