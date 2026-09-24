"use client";

/**
 * The analytics suite (yield simulator, hold model, payment plan) scoped
 * to one development's own unit types, with a selector between them —
 * same pattern as app/analytics/page.tsx, factored out so a development
 * page can embed it against just its own listings instead of the whole
 * sample inventory.
 */
import { useState } from "react";
import { TrendingUp, LineChart, Landmark } from "lucide-react";
import type { Property } from "@/lib/types";
import { CurrencyProvider } from "@/lib/currency-context";
import { CurrencyVisaToolbar } from "@/components/tools/CurrencyVisaToolbar";
import { YieldSimulator } from "@/components/tools/YieldSimulator";
import { HoldAppreciationModel } from "@/components/tools/HoldAppreciationModel";
import { PaymentPlanCalculator } from "@/components/tools/PaymentPlanCalculator";
import { InsightToolCard } from "@/components/ui/InsightToolCard";
import { Reveal } from "@/components/ui/Reveal";
import { ImageBreak } from "@/components/ui/ImageBreak";
import { GOLDEN_VISA_THRESHOLD_AED } from "@/lib/currency";
import type { PaymentStructureId } from "@/lib/paymentPlan";

const tools = [
  {
    icon: TrendingUp,
    title: "Yield strategy simulator",
    description: "Short-term let vs. long-term lease, side by side.",
    href: "#dev-yield-strategy",
  },
  {
    icon: LineChart,
    title: "5-year hold & appreciation",
    description: "Project equity growth under a market scenario.",
    href: "#dev-hold-appreciation",
  },
  {
    icon: Landmark,
    title: "Payment plan & fees",
    description: "Capital outlay by milestone, every fee at closing.",
    href: "#dev-payment-plan",
  },
];

export function DevelopmentAnalytics({
  properties,
  defaultPaymentStructureId,
}: {
  properties: Property[];
  defaultPaymentStructureId?: PaymentStructureId;
}) {
  const [slug, setSlug] = useState(properties[0].slug);
  const property = properties.find((p) => p.slug === slug) ?? properties[0];
  const estimatedAnnualNetCashFlow = Math.round(
    (property.expectedAnnualRentAed ?? property.priceAed * 0.05) * 0.85,
  );
  const gallery = property.gallery ?? [property.image];
  const breakImage = (i: number) => gallery[i % gallery.length];

  return (
    <div>
      <label className="block max-w-sm">
        <span className="text-sm text-slate/60">Unit type</span>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate/15 bg-canvas px-4 py-2.5 text-sm text-slate"
        >
          {properties.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title} · AED {p.priceAed.toLocaleString("en-AE")}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {tools.map((t, i) => (
          <Reveal key={t.title} delayMs={i * 100}>
            <InsightToolCard
              icon={t.icon}
              title={t.title}
              description={t.description}
              href={t.href}
            />
          </Reveal>
        ))}
      </div>

      <CurrencyProvider>
        <div className="mt-10 -mx-6 sm:-mx-10">
          <CurrencyVisaToolbar priceAed={property.priceAed} />
        </div>

        <div className="mt-10 space-y-16">
          <div id="dev-yield-strategy" className="scroll-mt-24">
            <h3 className="text-lg font-semibold text-slate">Yield strategy simulator</h3>
            <div className="mt-6">
              <YieldSimulator priceAed={property.priceAed} sqft={property.sqft} />
            </div>
          </div>

          <ImageBreak
            src={breakImage(2).src}
            alt={breakImage(2).alt}
            eyebrow="Golden Visa"
            value={`AED ${GOLDEN_VISA_THRESHOLD_AED.toLocaleString("en-AE")}`}
            label="Purchase price threshold for the 10-year UAE Golden Visa"
          />

          <div id="dev-hold-appreciation" className="scroll-mt-24">
            <h3 className="text-lg font-semibold text-slate">
              5-year hold &amp; appreciation model
            </h3>
            <div className="mt-6">
              <HoldAppreciationModel
                purchasePriceAed={property.priceAed}
                annualNetCashFlowAed={estimatedAnnualNetCashFlow}
              />
            </div>
          </div>

          <ImageBreak
            src={breakImage(4).src}
            alt={breakImage(4).alt}
            eyebrow={`${property.community}, ${property.city}`}
            value={`${property.sqft.toLocaleString("en-AE")} sqft`}
            label={property.title}
          />

          <div id="dev-payment-plan" className="scroll-mt-24">
            <h3 className="text-lg font-semibold text-slate">
              Payment plan &amp; fee transparency
            </h3>
            <div className="mt-6">
              <PaymentPlanCalculator
                priceAed={property.priceAed}
                city={property.city}
                defaultStructureId={defaultPaymentStructureId}
              />
            </div>
          </div>
        </div>
      </CurrencyProvider>
    </div>
  );
}
