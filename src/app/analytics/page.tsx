"use client";

/**
 * Standalone Analytics & Insight Suite — not yet in SITEMAP.md's confirmed
 * page list (same flag as app/invest/page.tsx: added on explicit request,
 * needs folding into the sitemap discussion rather than becoming a silent
 * permanent fixture). Distinct from the already-planned /insights (market
 * notes articles, per SITEMAP.md) — this is the interactive modelling
 * suite, keyed to a property the investor picks from current inventory.
 */
import { useState } from "react";
import { TrendingUp, LineChart, Landmark } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { sampleProperties } from "@/lib/sample-properties";
import { CurrencyProvider } from "@/lib/currency-context";
import { CurrencyVisaToolbar } from "@/components/tools/CurrencyVisaToolbar";
import { YieldSimulator } from "@/components/tools/YieldSimulator";
import { HoldAppreciationModel } from "@/components/tools/HoldAppreciationModel";
import { PaymentPlanCalculator } from "@/components/tools/PaymentPlanCalculator";
import { InsightToolCard } from "@/components/ui/InsightToolCard";
import { Reveal } from "@/components/ui/Reveal";
import { ImageBreak } from "@/components/ui/ImageBreak";
import { GOLDEN_VISA_THRESHOLD_AED } from "@/lib/currency";

const tools = [
  {
    icon: TrendingUp,
    title: "Yield strategy simulator",
    description: "Short-term let vs. long-term lease, side by side.",
    href: "#yield-strategy",
  },
  {
    icon: LineChart,
    title: "5-year hold & appreciation",
    description: "Project equity growth under a market scenario.",
    href: "#hold-appreciation",
  },
  {
    icon: Landmark,
    title: "Payment plan & fees",
    description: "Capital outlay by milestone, every fee at closing.",
    href: "#payment-plan",
  },
];

export default function AnalyticsPage() {
  const [slug, setSlug] = useState(sampleProperties[0].slug);
  const property = sampleProperties.find((p) => p.slug === slug) ?? sampleProperties[0];
  const estimatedAnnualNetCashFlow = Math.round(
    (property.expectedAnnualRentAed ?? property.priceAed * 0.05) * 0.85,
  );
  const gallery = property.gallery ?? [property.image];
  const breakImage = (i: number) => gallery[i % gallery.length];

  return (
    <main>
      <div className="relative bg-slate">
        <Nav />
        <div className="h-20" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <h1 className="text-3xl font-semibold text-slate sm:text-4xl">
          Analytics &amp; insight suite
        </h1>
        <p className="mt-3 max-w-xl text-slate/70">
          Model a deal against current inventory: yield strategy, five-year
          hold, payment plan and closing fees, all in one place.
        </p>

        <label className="mt-8 block max-w-sm">
          <span className="text-sm text-slate/60">Property</span>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate/15 bg-canvas px-4 py-2.5 text-sm text-slate"
          >
            {sampleProperties.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title} · AED {p.priceAed.toLocaleString("en-AE")}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
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
            <div id="yield-strategy" className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-slate">
                Yield strategy simulator
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate/60">
                Compare a short-term holiday let against a standard
                long-term lease.
              </p>
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

            <div id="hold-appreciation" className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-slate">
                5-year hold &amp; appreciation model
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate/60">
                Project equity growth over a hold period under a market
                scenario.
              </p>
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

            <div id="payment-plan" className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-slate">
                Payment plan &amp; fee transparency
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate/60">
                Capital outlay by milestone and every upfront fee due at
                closing.
              </p>
              <div className="mt-6">
                <PaymentPlanCalculator
                  priceAed={property.priceAed}
                  city={property.city}
                  defaultStructureId={
                    property.community === "Wadeem Gardens" ? "wadeem-adib" : "60-40"
                  }
                />
              </div>
            </div>
          </div>
        </CurrencyProvider>
      </section>

      <Footer />
    </main>
  );
}
