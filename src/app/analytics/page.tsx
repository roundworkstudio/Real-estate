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
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { sampleProperties } from "@/lib/sample-properties";
import { CurrencyProvider } from "@/lib/currency-context";
import { CurrencyVisaToolbar } from "@/components/tools/CurrencyVisaToolbar";
import { YieldSimulator } from "@/components/tools/YieldSimulator";
import { HoldAppreciationModel } from "@/components/tools/HoldAppreciationModel";
import { PaymentPlanCalculator } from "@/components/tools/PaymentPlanCalculator";

export default function AnalyticsPage() {
  const [slug, setSlug] = useState(sampleProperties[0].slug);
  const property = sampleProperties.find((p) => p.slug === slug) ?? sampleProperties[0];
  const estimatedAnnualNetCashFlow = Math.round(
    (property.expectedAnnualRentAed ?? property.priceAed * 0.05) * 0.85,
  );

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

        <CurrencyProvider>
          <div className="mt-8 -mx-6 sm:-mx-10">
            <CurrencyVisaToolbar priceAed={property.priceAed} />
          </div>

          <div className="mt-10 space-y-16">
            <div>
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

            <div>
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

            <div>
              <h2 className="text-xl font-semibold text-slate">
                Payment plan &amp; fee transparency
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate/60">
                Capital outlay by milestone and every upfront fee due at
                closing.
              </p>
              <div className="mt-6">
                <PaymentPlanCalculator priceAed={property.priceAed} city={property.city} />
              </div>
            </div>
          </div>
        </CurrencyProvider>
      </section>

      <Footer />
    </main>
  );
}
