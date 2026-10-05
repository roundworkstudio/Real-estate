/**
 * Property detail page — modern design with investment tools.
 * Features full-bleed hero image, modern stat strips, and investment analysis tools.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bath, BedDouble, Heart, Images, Landmark, LineChart, MapPin, MessageCircle, MoveUpRight, Phone, Ruler, TrendingUp } from "lucide-react";
import { sampleProperties } from "@/lib/sample-properties";
import { pricePerSqft } from "@/lib/types";
import { developments } from "@/lib/developments";
import { PAYMENT_STRUCTURES, type PaymentStructureId } from "@/lib/paymentPlan";
import { StatusBadge } from "@/components/ui/Badge";
import { StatStrip, type StatStripItem } from "@/components/ui/StatStrip";
import { BouncyAccordion, type BouncyAccordionItem } from "@/components/ui/BouncyAccordion";
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
import { PLACEHOLDER_TEL_URL } from "@/lib/site-config";

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
  const estimatedAnnualNetCashFlow = Math.round(
    (property.expectedAnnualRentAed ?? property.priceAed * 0.05) * 0.85,
  );

  const paymentStructureId: PaymentStructureId =
    property.community === "Wadeem Gardens" ? "wadeem-adib" : "60-40";

  const development = developments.find(
    (d) => d.name === property.community && d.city === property.city,
  );
  const eoiDate = development?.meta?.eoiTimeline?.[0];

  const heroStats: StatStripItem[] = [
    { value: `AED ${property.priceAed.toLocaleString("en-AE")}`, label: "Price" },
    {
      value: `AED ${pricePerSqft(property).toLocaleString("en-AE")}/sqft`,
      label: "Price / sqft",
    },
    ...(property.status === "off-plan"
      ? [
          {
            value: PAYMENT_STRUCTURES[paymentStructureId].splitLabel,
            label: "Payment plan",
          },
        ]
      : []),
    ...(eoiDate ? [{ value: eoiDate.date, label: eoiDate.label }] : []),
  ];

  const priceInMillions = property.priceAed / 1_000_000;
  const priceDisplay = priceInMillions >= 1
    ? `AED ${priceInMillions.toFixed(1)}m`
    : `AED ${(property.priceAed / 1000).toFixed(0)}k`;

  return (
    <main className="min-h-screen bg-canvas">
      <div className="relative hidden bg-slate md:block">
        <Nav />
        <div className="h-28" />
      </div>

      <section className="bg-gradient-to-b from-mist/70 to-canvas pt-28 md:pt-8">
        <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-10 sm:pb-12">
          <div className="mb-5 flex items-center justify-between">
            <Link href="/properties" className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-slate transition hover:bg-white"><ArrowLeft size={16} /> Back to properties</Link>
            <StatusBadge status={property.status} />
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-slate shadow-[0_25px_65px_-35px_rgba(58,45,40,.8)] sm:rounded-[2.5rem]">
            <div className="relative aspect-[4/5] max-h-[680px] sm:aspect-[16/9]">
              <img src={gallery[0]?.src ?? property.image.src} alt={gallery[0]?.alt ?? property.image.alt} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/10 to-transparent" />
              <button type="button" aria-label="Add to wishlist" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-canvas/85 text-slate backdrop-blur-sm sm:right-6 sm:top-6"><Heart size={19} /></button>
              <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-8 sm:left-8 sm:right-8">
                <div className="mb-2 flex items-center gap-1.5 text-sm text-white/75"><MapPin size={15} /> {property.community}, {property.city}</div>
                <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">{property.title}</h1>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/90"><span className="rounded-full bg-white/15 px-3 py-2 backdrop-blur-sm"><BedDouble className="mr-1 inline" size={15} /> {property.beds} beds</span>{property.baths !== undefined && <span className="rounded-full bg-white/15 px-3 py-2 backdrop-blur-sm"><Bath className="mr-1 inline" size={15} /> {property.baths} baths</span>}<span className="rounded-full bg-white/15 px-3 py-2 backdrop-blur-sm"><Ruler className="mr-1 inline" size={15} /> {property.sqft.toLocaleString("en-AE")} sqft</span></div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">{[...gallery.slice(1, 4)].map((img) => <img key={img.src} src={img.src} alt={img.alt} className="h-24 w-full rounded-2xl object-cover sm:h-32" />)}</div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <section className="grid gap-5 border-b border-slate/10 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:py-8">
          <div><p className="text-sm text-slate/55">Guide price</p><p className="mt-1 text-3xl font-semibold text-slate sm:text-4xl">{priceDisplay}</p></div>
          <a href="#investment" className="inline-flex items-center justify-center gap-2 rounded-full bg-royal-deep px-5 py-3 text-sm font-medium text-white transition hover:bg-royal">View investment tools <MoveUpRight size={16} /></a>
        </section>


        {/* Stats Section */}
        <section className="py-10 border-b border-slate/10">
          <StatStrip items={heroStats} />
        </section>

        {/* Gallery Grid */}
        <section className="py-10">
          <h2 className="text-2xl font-semibold text-slate mb-6">Inside the property</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {gallery.slice(1).map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                className="w-full aspect-[4/3] object-cover rounded-2xl shadow-md"
              />
            ))}
          </div>
        </section>

        {/* Description */}
        <section id="investment" className="border-t border-slate/10 py-10">
          <h2 className="text-xl font-semibold text-slate">About this property</h2>
          <p className="mt-4 max-w-2xl text-base text-slate/70 leading-relaxed">
            Placeholder description text standing in for the agent&apos;s own words — three or four sentences covering the property, the building, and what makes it worth viewing, at roughly the length the real copy is expected to run.
          </p>
        </section>

        {/* Investment Analysis */}
        <section className="border-t border-slate/10 py-10">
          <h2 className="text-xl font-semibold text-slate">Investment analysis</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate/60">
            Adjust the assumptions — every figure below recalculates live.
          </p>
          <div className="mt-8">
            <InvestmentCalculator
              priceAed={property.priceAed}
              estimatedMonthlyRentAed={estimatedMonthlyRent}
            />
          </div>
        </section>

        {/* Tools & Insights */}
        <CurrencyProvider>
          <div className="border-t border-slate/10">
            <CurrencyVisaToolbar priceAed={property.priceAed} />
          </div>

          <div className="py-10">
            <BouncyAccordion
              defaultValue="yield-strategy"
              items={[
                {
                  id: "yield-strategy",
                  title: "Yield strategy simulator",
                  description:
                    "Compare a short-term holiday let against a standard long-term lease for this property.",
                  icon: <TrendingUp size={18} strokeWidth={1.75} />,
                  content: (
                    <YieldSimulator priceAed={property.priceAed} sqft={property.sqft} />
                  ),
                },
                {
                  id: "hold-appreciation",
                  title: "5-year hold & appreciation model",
                  description:
                    "Project equity growth over a hold period under a market scenario.",
                  icon: <LineChart size={18} strokeWidth={1.75} />,
                  content: (
                    <HoldAppreciationModel
                      purchasePriceAed={property.priceAed}
                      annualNetCashFlowAed={estimatedAnnualNetCashFlow}
                    />
                  ),
                },
                ...(property.status === "off-plan"
                  ? [
                      {
                        id: "payment-plan",
                        title: "Payment plan & fee transparency",
                        description:
                          "Capital outlay by milestone and every upfront fee due at closing.",
                        icon: <Landmark size={18} strokeWidth={1.75} />,
                        content: (
                          <PaymentPlanCalculator
                            priceAed={property.priceAed}
                            city={property.city}
                            defaultStructureId={paymentStructureId}
                          />
                        ),
                      } satisfies BouncyAccordionItem,
                    ]
                  : []),
                ...(property.status !== "off-plan"
                  ? [
                      {
                        id: "before-after",
                        title: "Before & after",
                        description: "Sample renovation, illustrative only.",
                        icon: <Images size={18} strokeWidth={1.75} />,
                        content: (
                          <div className="max-w-2xl">
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
                        ),
                      } satisfies BouncyAccordionItem,
                    ]
                  : []),
              ]}
            />
          </div>
        </CurrencyProvider>
      </div>

      {/* Location */}
      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10 border-t border-slate/10">
        <h2 className="text-xl font-semibold text-slate">Location</h2>
        <div className="mt-6">
          <LocationMap query={`${property.community}, ${property.city}`} />
        </div>
        <p className="mt-4 max-w-2xl text-sm text-slate/70">
          Placeholder neighbourhood notes — schools, transport, and amenity copy for {property.community} goes here.
        </p>
      </section>

      {/* CTA Section - Modern Design */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <div className="rounded-3xl bg-gradient-to-br from-royal-deep/10 to-royal/5 border border-royal/20 p-10 sm:p-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate mb-2">
              Interested in this property?
            </h2>
            <p className="text-slate/70 mb-8">
              Let&apos;s discuss how this investment fits your portfolio. Schedule a call or reach out on WhatsApp for immediate assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button href={PLACEHOLDER_TEL_URL} variant="primary" className="flex items-center justify-center gap-2">
                <Phone size={18} />
                <span>Book a call</span>
              </Button>
              <Button href="https://wa.me/971555881148" variant="light" className="flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
