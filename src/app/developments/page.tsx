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
import { CalendarClock, Dumbbell, Sparkles, Trees, Waves } from "lucide-react";
import { derivedUnitMix, developments, developmentStats } from "@/lib/developments";
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
    "Compare off-plan and ready developments across Abu Dhabi and Dubai — payment plans, handover, unit mix and pricing at a glance.",
  openGraph: {
    title: "Projects · Janvi Real Estate",
    description:
      "Compare developments across Abu Dhabi and Dubai — payment plans, handover, unit mix and pricing at a glance.",
    images: [{ url: "/media/wadeem-gardens/hero.jpg", alt: "Aerial view of a villa community on the Abu Dhabi coastline" }],
  },
};

const HERO_IMAGE = {
  src: "/media/wadeem-gardens/hero.jpg",
  alt: "Aerial view of a villa community on the Abu Dhabi coastline",
};

export default function DevelopmentsPage() {
  return (
    <main>
      <section className="relative flex h-[48vh] min-h-[360px] flex-col justify-end overflow-hidden">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgb(0 0 0 / 0.65), rgb(0 0 0 / 0.05) 55%), linear-gradient(to right, rgb(0 0 0 / 0.5), transparent 60%)",
          }}
        />
        <Nav compactStyle />
        <div className="relative px-6 pb-10 sm:px-10 sm:pb-14">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Projects</h1>
          <p className="mt-3 max-w-lg text-white/80">
            Compare yield, entry price, and payment terms across a development
            before you shortlist a unit — built for buyers and investors, not
            a brochure of floor plans.
          </p>
          <div className="mt-5">
            <CurrencySwitcher />
          </div>
          <p className="mt-4 max-w-lg text-xs text-white/60">
            Sample inventory for layout — prices, yields and unit details are
            placeholders until live listings replace them.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        {developments.map((d, i) => {
          const stats = developmentStats(d);
          const cover = d.meta?.heroImage ?? d.properties[0].image;
          const imageFirst = i % 2 === 0;

          return (
            <div key={d.slug}>
              {i > 0 && (
                <ImageBreak
                  src={d.properties[0].gallery?.[2]?.src ?? cover.src}
                  alt={d.properties[0].gallery?.[2]?.alt ?? cover.alt}
                  eyebrow="Current projects"
                  value={`${developments.length} ${developments.length === 1 ? "project" : "projects"}`}
                  label={`across ${Array.from(new Set(developments.map((dev) => dev.city))).join(" & ")}`}
                />
              )}

              <section className="grid grid-cols-1 items-center gap-8 py-14 sm:grid-cols-2 sm:gap-12">
                <Reveal
                  direction={imageFirst ? "left" : "right"}
                  className={imageFirst ? "sm:order-1" : "sm:order-2"}
                >
                  <Link href={`/developments/${d.slug}`} tabIndex={-1} aria-hidden className="block">
                  <GlassCard maxDeg={6} className="overflow-hidden rounded-2xl bg-sand shadow-card">
                    <RevealImage
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      containerClassName="relative aspect-[4/3]"
                      className="object-cover"
                    />
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
                    <p className="mt-4 max-w-md text-sm text-slate/70">{d.meta.description}</p>
                  )}

                  <dl className="mt-6 divide-y divide-slate/10 rounded-2xl border border-white/80 bg-white/55 px-4 text-sm shadow-[inset_0_1px_2px_rgba(255,255,255,.85)]">
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
                      d.meta?.paymentPlan && { label: "Payment plan", value: d.meta.paymentPlan },
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

                  <a
                    href={`/developments/${d.slug}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-royal-deep px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-royal-deep/90"
                  >
                    View project
                  </a>
                </Reveal>
              </section>
            </div>
          );
        })}
      </div>

      <Footer />
    </main>
  );
}
