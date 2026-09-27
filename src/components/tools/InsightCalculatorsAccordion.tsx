"use client";

import { useState } from "react";
import { TrendingUp, LineChart, Landmark } from "lucide-react";
import { sampleProperties } from "@/lib/sample-properties";
import { CurrencyProvider } from "@/lib/currency-context";
import { CurrencyVisaToolbar } from "@/components/tools/CurrencyVisaToolbar";
import { YieldSimulator } from "@/components/tools/YieldSimulator";
import { HoldAppreciationModel } from "@/components/tools/HoldAppreciationModel";
import { PaymentPlanCalculator } from "@/components/tools/PaymentPlanCalculator";
import { BouncyAccordion, type BouncyAccordionItem } from "@/components/ui/BouncyAccordion";

export function InsightCalculatorsAccordion() {
  const [slug, setSlug] = useState(sampleProperties[0].slug);
  const property = sampleProperties.find((p) => p.slug === slug) ?? sampleProperties[0];
  const estimatedAnnualNetCashFlow = Math.round(
    (property.expectedAnnualRentAed ?? property.priceAed * 0.05) * 0.85,
  );

  const items: BouncyAccordionItem[] = [
    {
      id: "yield-strategy",
      title: "Yield strategy simulator",
      description: "Short-term let vs. long-term lease, side by side.",
      icon: <TrendingUp size={18} />,
      content: (
        <YieldSimulator priceAed={property.priceAed} sqft={property.sqft} />
      ),
    },
    {
      id: "hold-appreciation",
      title: "5-year hold & appreciation model",
      description: "Project equity growth under a market scenario.",
      icon: <LineChart size={18} />,
      content: (
        <HoldAppreciationModel
          purchasePriceAed={property.priceAed}
          annualNetCashFlowAed={estimatedAnnualNetCashFlow}
        />
      ),
    },
    {
      id: "payment-plan",
      title: "Payment plan & fee transparency",
      description: "Capital outlay by milestone, every fee at closing.",
      icon: <Landmark size={18} />,
      content: (
        <PaymentPlanCalculator
          priceAed={property.priceAed}
          city={property.city}
          defaultStructureId={
            property.community === "Wadeem Gardens" ? "wadeem-adib" : "60-40"
          }
        />
      ),
    },
  ];

  return (
    <CurrencyProvider>
      <div className="mt-10 border-t border-slate/10 pt-8 sm:mt-16 sm:pt-12">
        <h2 className="text-2xl font-semibold text-slate">Insight calculators</h2>
        <p className="mt-2 max-w-lg text-sm text-slate/60">
          Model a deal against any listing — yield strategy, five-year hold, and
          payment plan all in one place.
        </p>

        <label className="mt-6 block max-w-sm sm:mt-8">
          <span className="text-sm text-slate/60">Property</span>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-2 w-full truncate rounded-xl border border-slate/15 bg-white/60 px-4 py-2.5 text-sm text-slate"
          >
            {sampleProperties.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title} · AED {p.priceAed.toLocaleString("en-AE")}
              </option>
            ))}
          </select>
        </label>

        <div className="-mx-6 mt-5 sm:-mx-10 sm:mt-8">
          <CurrencyVisaToolbar priceAed={property.priceAed} />
        </div>

        <BouncyAccordion
          items={items}
          defaultValue="yield-strategy"
          className="mt-5 sm:mt-8"
        />
      </div>
    </CurrencyProvider>
  );
}
