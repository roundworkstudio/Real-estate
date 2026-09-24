/**
 * Property detail page — first rough draft. Section order follows
 * docs/property-page-spec.md at rough fidelity (per docs/what-worked.md,
 * "breadth before depth" — this page didn't exist before; it's roughed in
 * now specifically to host the two real tools requested: the investment
 * calculator and the before/after slider, both of which the spec places
 * here, not on the homepage).
 *
 * Not built yet, honestly stubbed rather than faked: location map (no geo
 * data source decided), similar properties (only two sample listings
 * exist total, so "similar" is meaningless right now), agent card (no
 * headshot/bio — see HANDOVER.md).
 */
import { notFound } from "next/navigation";
import { sampleProperties } from "@/lib/sample-properties";
import { pricePerSqft } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { InvestmentCalculator } from "@/components/tools/InvestmentCalculator";
import { BeforeAfterSlider } from "@/components/tools/BeforeAfterSlider";
import { YieldSimulator } from "@/components/tools/YieldSimulator";
import { HoldAppreciationModel } from "@/components/tools/HoldAppreciationModel";
import { PaymentPlanCalculator } from "@/components/tools/PaymentPlanCalculator";
import { CurrencyVisaToolbar } from "@/components/tools/CurrencyVisaToolbar";
import { CurrencyProvider } from "@/lib/currency-context";
import { LocationMap } from "@/components/ui/LocationMap";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export function generateStaticParams() {
  return sampleProperties.map((p) => ({ slug: p.slug }));
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = sampleProperties.find((p) => p.slug === slug);
  if (!property) notFound();

  const gallery = property.gallery ?? [property.image];
  const estimatedMonthlyRent = property.expectedAnnualRentAed
    ? Math.round(property.expectedAnnualRentAed / 12)
    : Math.round(property.priceAed * 0.05) / 12;
  // Rough net-of-opex estimate for the hold model's flat cash-flow
  // assumption (15% opex ratio) — not a per-listing figure, see
  // lib/holdAppreciation.ts's simplification note.
  const estimatedAnnualNetCashFlow = Math.round(
    (property.expectedAnnualRentAed ?? property.priceAed * 0.05) * 0.85,
  );

  return (
    <main>
      <div className="relative bg-slate">
        <Nav />
        <div className="h-20" />
      </div>

      {/* 1. Gallery — full-bleed images, lightbox/keyboard nav not built
          yet (rough fidelity). */}
      <section className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        {gallery.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            className={`aspect-[4/3] w-full object-cover ${i === 0 ? "sm:col-span-2 sm:aspect-[8/5]" : ""}`}
          />
        ))}
      </section>

      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        {/* 2. Headline + 3. Key facts */}
        <section className="py-10">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={property.status} />
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-slate sm:text-4xl">
            AED {property.priceAed.toLocaleString("en-AE")}
          </h1>
          <div className="mt-1 text-lg text-slate/70">
            {property.title} · {property.community}, {property.city}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate/70">
            <span>{property.beds} bed</span>
            <span>{property.baths} bath</span>
            <span>{property.sqft.toLocaleString("en-AE")} sqft</span>
            <span>AED {pricePerSqft(property).toLocaleString("en-AE")}/sqft</span>
          </div>
        </section>

        {/* 4. Description — LAYOUT FILLER, not the agent's own words. See
            CONTENT-CHECKLIST.md for the real copy this stands in for. */}
        <section className="border-t border-slate/10 py-10">
          <h2 className="text-xl font-semibold text-slate">Description</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate/70">
            Placeholder description text standing in for the agent&apos;s
            own words — three or four sentences covering the property, the
            building, and what makes it worth viewing, at roughly the
            length the real copy is expected to run.
          </p>
        </section>

        {/* 6. Investment analysis — the real tool. */}
        <section className="border-t border-slate/10 py-10">
          <h2 className="text-xl font-semibold text-slate">
            Investment analysis
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate/60">
            Adjust the assumptions — every figure below recalculates live.
          </p>
          <div className="mt-6">
            <InvestmentCalculator
              priceAed={property.priceAed}
              estimatedMonthlyRentAed={estimatedMonthlyRent}
            />
          </div>
        </section>

        {/* Analytics & Insight Suite — yield strategy, 5-year hold model,
            payment plan and fee transparency. Deeper, optional layer on
            top of the Investment analysis calculator above, not a
            replacement for it. */}
        <CurrencyProvider>
          <div className="border-t border-slate/10">
            <CurrencyVisaToolbar priceAed={property.priceAed} />
          </div>

          <section className="py-10">
            <h2 className="text-xl font-semibold text-slate">
              Yield strategy simulator
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate/60">
              Compare a short-term holiday let against a standard long-term
              lease for this property.
            </p>
            <div className="mt-6">
              <YieldSimulator priceAed={property.priceAed} sqft={property.sqft} />
            </div>
          </section>

          <section className="border-t border-slate/10 py-10">
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
          </section>

          {property.status === "off-plan" && (
            <section className="border-t border-slate/10 py-10">
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
            </section>
          )}
        </CurrencyProvider>

        {/* Before & after — the real widget, sample photos/costs. */}
        <section className="border-t border-slate/10 py-10">
          <h2 className="text-xl font-semibold text-slate">Before &amp; after</h2>
          <div className="mx-auto mt-6 max-w-2xl">
            <BeforeAfterSlider
              beforeSrc={gallery[1]?.src ?? property.image.src}
              afterSrc={gallery[0]?.src ?? property.image.src}
              capex={[
                { label: "Kitchen refit", amount: 85_000 },
                { label: "Flooring", amount: 42_000 },
                { label: "Landscaping", amount: 28_000 },
              ]}
              rentIncreaseAed={3_200}
              isSample
            />
          </div>
        </section>
      </div>

      {/* 9. Location — real map, no API key needed. See LocationMap's
          note: this is a stopgap embed, swap for Mapbox once there's a
          token. */}
      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <h2 className="text-xl font-semibold text-slate">Location</h2>
        <div className="mt-6">
          <LocationMap query={`${property.community}, ${property.city}`} />
        </div>
        <p className="mt-4 max-w-2xl text-sm text-slate/70">
          Placeholder neighbourhood notes — schools, transport, and amenity
          copy for {property.community} goes here, pulled from the
          matching /areas page once it exists.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <div className="rounded-2xl bg-sand p-8 text-center">
          <h2 className="text-xl font-semibold text-slate">
            Interested in this property?
          </h2>
          <div className="mt-4">
            <Button variant="primary">Book a call</Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
