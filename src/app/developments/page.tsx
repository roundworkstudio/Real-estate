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
import { ArrowRight, CalendarClock, Dumbbell, Sparkles, Trees, Waves } from "lucide-react";
import { completedProjects, derivedUnitMix, developments, developmentStats, JANVIS_TAKE, type Development } from "@/lib/developments";
import { ProjectsShowcase } from "@/components/tools/ProjectsShowcase";
import { WhatsAppBanner } from "@/components/tools/WhatsAppBanner";
import { PriceListRequest } from "@/components/tools/PriceListRequest";
import { CurrencyIcon } from "@/components/tools/CurrencyIcon";
import { PaymentTimeline } from "@/components/ui/PaymentTimeline";
import { JanviTake } from "@/components/ui/JanviTake";
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

function amenityIcon(amenity: string) {
  const a = amenity.toLowerCase();
  if (a.includes("pool")) return <Waves size={13} />;
  if (a.includes("gym")) return <Dumbbell size={13} />;
  if (a.includes("garden") || a.includes("park")) return <Trees size={13} />;
  return <Sparkles size={13} />;
}

export const metadata: Metadata = {
  title: "Projects · Janvi Real Estate",
  description:
    "Current and completed developments across Abu Dhabi and Dubai — payment plans, handover and unit mix for projects selling now, and price growth on completed ones.",
  openGraph: {
    title: "Projects · Janvi Real Estate",
    description:
      "Current and completed developments across Abu Dhabi and Dubai, with price growth since launch.",
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

function statusLabel(d: Development): string {
  if (d.meta?.salesStatus) return d.meta.salesStatus;
  return d.properties.every((p) => p.status === "off-plan") ? "Off-plan" : "Ready to move";
}

function bedRange(d: Development): string {
  const beds = d.properties.map((p) => p.beds);
  const min = Math.min(...beds);
  const max = Math.max(...beds);
  return min === max ? `${min}` : `${min}–${max}`;
}

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
              Developments Janvi is selling now, and ones she&rsquo;s seen through
              to completion.
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
                    eyebrow="Current projects"
                    value={`${developments.length} ${developments.length === 1 ? "project" : "projects"}`}
                    label={`across ${Array.from(new Set(developments.map((dev) => dev.city))).join(" & ")}`}
                  />
                </div>
              )}

              <Reveal className={i === 0 ? "pt-8 sm:hidden" : "pt-5 sm:hidden"}>
                <article className="relative overflow-hidden rounded-[2rem] shadow-[0_24px_50px_-28px_rgba(58,45,40,.7)]">
                  <div className={`relative ${d.meta?.paymentStructureId ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      quality={90}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate/55 via-transparent via-50% to-slate/15" />
                  <span className="liquid-glass liquid-glass--tint absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-medium text-white">
                    {statusLabel(d)}
                  </span>
                  <div className="liquid-glass liquid-glass--tint absolute inset-x-3 bottom-3 rounded-[1.5rem] p-4 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-white/80">
                        {d.meta ? `${d.meta.developer} · ` : ""}{d.city}
                      </p>
                      <Link
                        href={`/properties#homes-${d.slug}`}
                        className="-my-2 inline-flex items-center gap-1 py-2 text-xs font-medium text-white underline-offset-2 hover:underline"
                      >
                        See homes <ArrowRight size={12} />
                      </Link>
                    </div>
                    <h2 className="mt-0.5 text-2xl font-semibold leading-tight">
                      <Link href={`/developments/${d.slug}`}>{d.name}</Link>
                    </h2>
                    <dl className="mt-3 grid grid-cols-3 divide-x divide-white/20 text-center">
                      <div className="pr-2">
                        <dt className="text-[11px] text-white/75">From</dt>
                        <dd className="mt-0.5 text-sm font-semibold"><FormattedPrice amountAed={stats.minPriceAed} /></dd>
                      </div>
                      <div className="px-2">
                        <dt className="text-[11px] text-white/75">Bedrooms</dt>
                        <dd className="mt-0.5 text-sm font-semibold">{bedRange(d)}</dd>
                      </div>
                      <div className="pl-2">
                        <dt className="text-[11px] text-white/75">Listed</dt>
                        <dd className="mt-0.5 text-sm font-semibold">{stats.unitCount} {stats.unitCount === 1 ? "home" : "homes"}</dd>
                      </div>
                    </dl>
                    <PaymentTimeline
                      structureId={d.meta?.paymentStructureId}
                      fromPriceAed={stats.minPriceAed}
                      tone="dark"
                      className="mt-3 border-t border-white/20 pt-3"
                    />
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={`/developments/${d.slug}`}
                        className="flex items-center justify-center whitespace-nowrap rounded-full bg-white px-3 py-2.5 text-sm font-medium text-slate transition-colors hover:bg-white/90"
                      >
                        Explore project
                      </Link>
                      <PriceListRequest project={d.name} developer={d.meta?.developer} variant="glass" className="whitespace-nowrap px-3" />
                    </div>
                  </div>
                </article>
                {JANVIS_TAKE[d.slug] && (
                  <JanviTake quote={JANVIS_TAKE[d.slug]} variant="bubble" className="mx-3 mt-4" />
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
                  {JANVIS_TAKE[d.slug] && <JanviTake quote={JANVIS_TAKE[d.slug]} className="mt-5 max-w-md" />}

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
                      { label: "Unit mix", value: d.meta?.unitMix ?? derivedUnitMix(d) },
                      !d.meta?.paymentStructureId && d.meta?.paymentPlan && { label: "Payment plan", value: d.meta.paymentPlan },
                      d.meta?.handover && { label: "Handover", value: d.meta.handover },
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
                      See homes <ArrowRight size={14} />
                    </Link>
                  </div>
                </Reveal>
              </section>
            </div>
          );
        })}
        />
        <div className="pb-14">
          <WhatsAppBanner />
        </div>
      </div>

      <Footer />
    </main>
  );
}
