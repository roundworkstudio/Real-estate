/**
 * Developments index — groups current listings by project. SITEMAP.md
 * plans `/developments/[slug]` but not an index; adding one here since
 * browsing by project is the actual ask, same "not yet in SITEMAP.md, flag
 * it" pattern used for other provisional routes.
 *
 * Redesigned 2026-09-24 from a plain title + small card grid to a
 * full-bleed hero and alternating editorial rows — the small-card version
 * read as an afterthought next to the rest of the site's photography-led
 * pages. Each row alternates image side and Reveal direction (left/right,
 * not just fade-up) purely for rhythm across the two rows that exist
 * today; with more projects it naturally continues alternating.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { amenityIcon } from "@/components/ui/AmenityTiles";
import { completedProjects, derivedUnitMix, developments, developmentStats, JANVIS_TAKE, JANVIS_TAKE_HIGHLIGHT, upcomingLaunches } from "@/lib/developments";
import { bedRange, statusLabel } from "@/lib/project-facts";
import { ProjectStats, SampleChip } from "@/components/ui/ProjectStats";
import { ProjectsShowcase } from "@/components/tools/ProjectsShowcase";
import { WhatsAppBanner } from "@/components/tools/WhatsAppBanner";
import { ExploreNext } from "@/components/ui/ExploreNext";
import { PriceListRequest } from "@/components/tools/PriceListRequest";
import { CurrencyIcon } from "@/components/tools/CurrencyIcon";
import { PaymentTimeline } from "@/components/ui/PaymentTimeline";
import { JanviTake } from "@/components/ui/JanviTake";
import { PROJECT_CARD_PRIMARY, ProjectPhotoCard } from "@/components/ui/ProjectPhotoCard";
import type { CurrencyCode } from "@/lib/currency";
import { RevealImage } from "@/components/ui/RevealImage";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { ImageBreak } from "@/components/ui/ImageBreak";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { FormattedPrice } from "@/components/ui/FormattedPrice";
import { CurrencySwitcher } from "@/components/tools/CurrencySwitcher";

type GlanceRow = { label: string; value: React.ReactNode };

export const metadata: Metadata = {
  title: "Projects · Janvi Real Estate",
  description:
    "Upcoming launches, projects selling now and completed developments across Abu Dhabi and Dubai: priority access, payment plans, handover and price growth since launch.",
  openGraph: {
    title: "Projects · Janvi Real Estate",
    description:
      "Upcoming launches, projects selling now and completed developments across Abu Dhabi and Dubai.",
    images: [{ url: "/media/wadeem-gardens/hero.jpg", alt: "Aerial view of a villa community on the Abu Dhabi coastline" }],
  },
};

const HERO_IMAGE = {
  src: "/media/wadeem-gardens/amenity-pool.jpg",
  alt: "Resort-style community pool lined with trees and sun loungers at Wadeem Gardens",
};

/** PLACEHOLDER — invented for layout and labelled "Sample" on the page.
 * Replace with the real count and Janvi's top buyer nationalities. */
const BUYER_COUNTRY_COUNT = 14;
const BUYER_FLAGS: CurrencyCode[] = ["GBP", "INR", "USD", "EUR", "AED"];
const MOBILE_FLAG_COUNT = 3;

export default function DevelopmentsPage() {
  return (
    <main>
      <section className="relative flex flex-col justify-end overflow-hidden pt-36 sm:h-[56vh] sm:min-h-[440px] sm:pt-0">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          preload
          quality={90}
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate/45 via-transparent via-45% to-slate/25" />
        <Nav compactStyle />
        <div className="relative px-4 pb-4 sm:px-10 sm:pb-10">
          <div className="liquid-glass liquid-glass--tint max-w-xl rounded-[2rem] p-6 sm:p-8">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Projects</h1>
            <p className="mt-2 max-w-lg text-white/90">
              Get in before launch, buy while it&rsquo;s being built, and see how
              the projects Janvi has seen through have grown.
            </p>
            <div className="mt-5">
              <CurrencySwitcher />
            </div>
            <p className="mt-4 max-w-lg text-xs text-white/75">
              Sample inventory for layout — prices, yields and unit details are
              placeholders until live listings replace them.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <div className="mt-8 flex justify-center">
          <div className="liquid-glass-light inline-flex items-center gap-2 rounded-full py-2 pl-2.5 pr-3 sm:gap-3 sm:pr-4">
            <span className="flex -space-x-2" aria-hidden>
              {BUYER_FLAGS.map((code, i) => (
                <span key={code} className={`rounded-full ring-2 ring-white ${i >= MOBILE_FLAG_COUNT ? "hidden sm:block" : ""}`}>
                  <CurrencyIcon code={code} size={24} />
                </span>
              ))}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-white ring-2 ring-white">
                <span className="sm:hidden">+{BUYER_COUNTRY_COUNT - MOBILE_FLAG_COUNT}</span>
                <span className="hidden sm:inline">+{BUYER_COUNTRY_COUNT - BUYER_FLAGS.length}</span>
              </span>
            </span>
            <span className="whitespace-nowrap text-[13px] text-slate sm:text-sm">
              <span className="hidden sm:inline">Janvi&rsquo;s buyers come from </span>
              <span className="sm:hidden">Buyers from </span>
              <span className="font-semibold">{BUYER_COUNTRY_COUNT} countries</span>
            </span>
            <span className="rounded-full bg-slate/10 px-2 py-0.5 text-[10px] font-medium text-slate/70">Sample</span>
          </div>
        </div>
        <ProjectsShowcase
          upcoming={upcomingLaunches}
          completed={completedProjects}
          currentPoints={developments.map((d) => ({
            slug: d.slug,
            name: d.name,
            area: d.city,
            query: `${d.name}, ${d.city}`,
          }))}
          current={developments.map((d, i) => {
          const stats = developmentStats(d);
          const cover = d.meta?.heroImage ?? d.properties[0].image;
          const imageFirst = i % 2 === 0;
          const breakImage = d.properties[0].gallery?.[0];

          return (
            <div key={d.slug}>
              {i > 0 && breakImage && (
                <div className="hidden sm:block">
                  <ImageBreak
                    src={breakImage.src}
                    alt={breakImage.alt}
                    eyebrow="Selling now"
                    value={`${developments.length} ${developments.length === 1 ? "project" : "projects"}`}
                    label={`across ${Array.from(new Set(developments.map((dev) => dev.city))).join(" & ")}`}
                  />
                </div>
              )}

              <Reveal className={i === 0 ? "pt-8 sm:hidden" : "pt-5 sm:hidden"}>
                <ProjectPhotoCard image={cover} badge={statusLabel(d)}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-white/80">
                        {d.meta ? `${d.meta.developer} · ` : ""}{d.city}
                      </p>
                      <Link
                        href={`/properties#homes-${d.slug}`}
                        className="-my-2 inline-flex items-center gap-1 py-2 text-xs font-medium text-white underline-offset-2 hover:underline"
                      >
                        Available homes <ArrowRight size={12} />
                      </Link>
                    </div>
                    <h2 className="mt-0.5 text-2xl font-semibold leading-tight">
                      <Link href={`/developments/${d.slug}`}>{d.name}</Link>
                    </h2>
                    <ProjectStats development={d} onDark className="mt-3" />
                    <PaymentTimeline
                      structureId={d.meta?.paymentStructureId}
                      fromPriceAed={stats.minPriceAed}
                      tone="dark"
                      className="mt-3 border-t border-white/20 pt-3"
                    />
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link href={`/developments/${d.slug}`} className={PROJECT_CARD_PRIMARY}>
                        Explore project
                      </Link>
                      <PriceListRequest project={d.name} developer={d.meta?.developer} variant="glass" className="whitespace-nowrap px-3" />
                    </div>
                </ProjectPhotoCard>
                {JANVIS_TAKE[d.slug] && (
                  <JanviTake quote={JANVIS_TAKE[d.slug]} highlight={JANVIS_TAKE_HIGHLIGHT[d.slug]} variant="bubble" className="mx-3 mt-4" />
                )}
              </Reveal>

              <section className="hidden items-center gap-12 py-14 sm:grid sm:grid-cols-2">
                <Reveal
                  direction={imageFirst ? "left" : "right"}
                  className={imageFirst ? "sm:order-1" : "sm:order-2"}
                >
                  <Link href={`/developments/${d.slug}`} tabIndex={-1} aria-hidden className="block">
                  <GlassCard maxDeg={6} className="relative overflow-hidden rounded-2xl bg-sand shadow-card">
                    <RevealImage
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      quality={90}
                      sizes="(min-width: 640px) 50vw, 100vw"
                      containerClassName="relative aspect-[4/3]"
                      className="object-cover"
                    />
                    <span className="liquid-glass liquid-glass--tint absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-xs font-medium text-white">
                      {statusLabel(d)}
                    </span>
                  </GlassCard>
                  </Link>
                </Reveal>

                <Reveal
                  direction={imageFirst ? "right" : "left"}
                  delayMs={100}
                  className={imageFirst ? "sm:order-2" : "sm:order-1"}
                >
                  {d.meta && (
                    <div className="text-sm font-medium text-slate/70">{d.meta.developer}</div>
                  )}
                  <h2 className="mt-1 text-2xl font-semibold text-slate sm:text-3xl">
                    <Link href={`/developments/${d.slug}`} className="transition-colors hover:text-royal">
                      {d.name}
                    </Link>
                  </h2>
                  <div className="mt-1 text-slate/70">{d.city}</div>
                  {d.meta && (
                    <p className="mt-4 line-clamp-2 max-w-md text-sm text-slate/70">{d.meta.description}</p>
                  )}
                  {JANVIS_TAKE[d.slug] && <JanviTake quote={JANVIS_TAKE[d.slug]} highlight={JANVIS_TAKE_HIGHLIGHT[d.slug]} className="mt-5 max-w-md" />}

                  <div className="liquid-glass-light mt-6 rounded-2xl text-sm">
                  <PaymentTimeline
                    structureId={d.meta?.paymentStructureId}
                    fromPriceAed={stats.minPriceAed}
                    className="border-b border-slate/10 p-4"
                  />
                  <dl className="divide-y divide-slate/10 px-4">
                    {([
                      {
                        label: "Price range",
                        value: stats.minPriceAed === stats.maxPriceAed ? (
                          <FormattedPrice amountAed={stats.minPriceAed} />
                        ) : (
                          <>
                            <FormattedPrice amountAed={stats.minPriceAed} />
                            {" – "}
                            <FormattedPrice amountAed={stats.maxPriceAed} />
                          </>
                        ),
                      },
                      { label: "Bedrooms", value: bedRange(d) },
                      { label: "Handover", value: d.meta?.handover ?? "To be confirmed" },
                      d.meta?.construction && {
                        label: "Construction",
                        value: (
                          <>
                            {d.meta.construction.percent}% built
                            {d.meta.construction.isSample && <SampleChip />}
                          </>
                        ),
                      },
                      { label: "Avg. price per sqft", value: <FormattedPrice amountAed={stats.avgPricePerSqftAed} compact={false} /> },
                      { label: "Unit mix", value: d.meta?.unitMix ?? derivedUnitMix(d) },
                      !d.meta?.paymentStructureId && d.meta?.paymentPlan && { label: "Payment plan", value: d.meta.paymentPlan },
                      d.meta?.developerRecord && {
                        label: "Developer record",
                        value: (
                          <>
                            {d.meta.developerRecord.delivered} delivered · {d.meta.developerRecord.onTime}
                            {d.meta.developerRecord.isSample && <SampleChip />}
                          </>
                        ),
                      },
                      stats.avgGrossYieldPercent !== null && {
                        label: "Avg. gross yield",
                        value: <span className="font-medium text-sovereign">{stats.avgGrossYieldPercent.toFixed(1)}%</span>,
                      },
                    ] as (GlanceRow | false | "" | undefined)[])
                      .filter((row): row is GlanceRow => Boolean(row))
                      .map((row) => (
                        <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
                          <dt className="shrink-0 text-slate/70">{row.label}</dt>
                          <dd className="text-right font-medium text-slate">{row.value}</dd>
                        </div>
                      ))}
                  </dl>
                  </div>

                  {d.meta?.amenities.length ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Key amenities">
                      {d.meta.amenities.slice(0, 3).map((amenity) => (
                        <li key={amenity} className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-xs text-slate">
                          {amenityIcon(amenity)} {amenity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-slate/70">
                      <CalendarClock size={13} /> Payment plan and handover details to be confirmed with the developer.
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <Link
                      href={`/developments/${d.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-royal-deep px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-royal-deep/90"
                    >
                      Explore project
                    </Link>
                    <PriceListRequest project={d.name} developer={d.meta?.developer} />
                    <Link
                      href={`/properties#homes-${d.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-royal-deep transition-colors hover:text-royal"
                    >
                      Available homes <ArrowRight size={14} />
                    </Link>
                  </div>
                </Reveal>
              </section>
            </div>
          );
        })}
        />
        <ExploreNext
          className="mb-10 sm:mb-14"
          eyebrow="Properties"
          title="Ready to look at individual homes?"
          body="Every home across these projects in one place, with prices, layouts and a side-by-side compare."
          href="/properties"
          cta="Browse homes"
          image={{ src: "/media/hero/ramhan-villa-poolview-hero.jpg", alt: "Infinity pool looking out over the water from a villa" }}
        />
        <div className="pb-14">
          <WhatsAppBanner />
        </div>
      </div>

      <Footer />
    </main>
  );
}
