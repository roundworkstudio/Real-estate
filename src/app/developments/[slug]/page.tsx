/**
 * Single development (project) page — per SITEMAP.md's
 * `/developments/[slug]` ("Development page, shared updates feed"). The
 * updates feed itself is honestly stubbed, not faked: there's no content
 * source for project updates yet (no CMS, no agent-authored posts), same
 * treatment as the property page's location notes and similar-properties
 * section — see that page's top comment for the pattern this follows.
 *
 * Renders richer content (hero image, developer, amenities, EOI timeline,
 * site plan, a modelling suite scoped to this project) only where
 * lib/developments.ts has real metadata for the development — a plain
 * community grouping with no such source still gets the baseline
 * stats/listings/map/updates sections, nothing invented to fill the gap.
 */
import Image from "next/image";
import { notFound } from "next/navigation";
import { developments, getDevelopment, developmentStats } from "@/lib/developments";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { LocationMap } from "@/components/ui/LocationMap";
import { DevelopmentAnalytics } from "@/components/tools/DevelopmentAnalytics";
import { ImageBreak } from "@/components/ui/ImageBreak";
import { RevealImage } from "@/components/ui/RevealImage";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return developments.map((d) => ({ slug: d.slug }));
}

export default async function DevelopmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const development = getDevelopment(slug);
  if (!development) notFound();

  const stats = developmentStats(development);
  const meta = development.meta;
  const breakGallery = development.properties[0].gallery ?? [development.properties[0].image];
  const breakImage = breakGallery[Math.min(2, breakGallery.length - 1)];

  return (
    <main>
      {meta ? (
        <section className="relative flex h-[56vh] min-h-[420px] flex-col justify-end overflow-hidden">
          <Image
            src={meta.heroImage.src}
            alt={meta.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgb(0 0 0 / 0.65), rgb(0 0 0 / 0.05) 55%), linear-gradient(to right, rgb(0 0 0 / 0.4), rgb(0 0 0 / 0) 60%)",
            }}
          />
          <Nav />
          <div className="relative px-6 pb-10 sm:px-10 sm:pb-14">
            <div className="text-sm font-medium text-white/70">{meta.developer}</div>
            <h1 className="mt-1 text-3xl font-semibold text-white sm:text-4xl">
              {development.name}
            </h1>
            <div className="mt-1 text-white/80">{development.city}</div>
          </div>
        </section>
      ) : (
        <div className="relative bg-slate">
          <Nav />
          <div className="h-20" />
        </div>
      )}

      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        {!meta && (
          <>
            <h1 className="text-3xl font-semibold text-slate sm:text-4xl">
              {development.name}
            </h1>
            <div className="mt-1 text-lg text-slate/70">{development.city}</div>
          </>
        )}

        {/* Project insight — every figure computed live from the listings
            in this development, see lib/developments.ts. */}
        <div
          className={`grid grid-cols-2 gap-6 text-center sm:grid-cols-4 ${meta ? "" : "mt-8"}`}
        >
          <div>
            <div className="text-2xl font-semibold tabular-nums text-slate sm:text-3xl">
              {stats.unitCount}
            </div>
            <div className="mt-1 text-sm text-slate/60">
              {stats.unitCount === 1 ? "Listing" : "Listings"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold tabular-nums text-slate sm:text-3xl">
              AED {stats.minPriceAed.toLocaleString("en-AE")}
              {stats.minPriceAed !== stats.maxPriceAed &&
                ` – ${stats.maxPriceAed.toLocaleString("en-AE")}`}
            </div>
            <div className="mt-1 text-sm text-slate/60">Price range</div>
          </div>
          <div>
            <div className="text-2xl font-semibold tabular-nums text-slate sm:text-3xl">
              AED {stats.avgPricePerSqftAed.toLocaleString("en-AE")}
            </div>
            <div className="mt-1 text-sm text-slate/60">Avg. price/sqft</div>
          </div>
          <div>
            <div className="text-2xl font-semibold tabular-nums text-sovereign sm:text-3xl">
              {stats.avgGrossYieldPercent === null
                ? "—"
                : `${stats.avgGrossYieldPercent.toFixed(1)}%`}
            </div>
            <div className="mt-1 text-sm text-slate/60">Avg. gross yield</div>
          </div>
        </div>
      </section>

      {meta && (
        <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
          <p className="max-w-2xl text-slate/80">{meta.description}</p>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-slate">Amenities</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate/70">
                {meta.amenities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>

            {meta.eoiTimeline && (
              <div>
                <h2 className="text-lg font-semibold text-slate">EOI timeline</h2>
                <p className="mt-1 text-xs text-slate/50">
                  Dates as published by the developer — no year was stated in
                  the source, so none is assumed here.
                </p>
                <ol className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
                  {meta.eoiTimeline.map((t) => (
                    <li key={t.label}>
                      <div className="text-xl font-semibold tabular-nums text-slate">
                        {t.date}
                      </div>
                      <div className="mt-0.5 text-xs text-slate/60">{t.label}</div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <h2 className="text-xl font-semibold text-slate">
          Listings in {development.name}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {development.properties.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <ImageBreak
          src={breakImage.src}
          alt={breakImage.alt}
          eyebrow={development.city}
          value={`${stats.unitCount} ${stats.unitCount === 1 ? "unit" : "units"}`}
          label={`AED ${stats.minPriceAed.toLocaleString("en-AE")}${
            stats.minPriceAed !== stats.maxPriceAed
              ? ` – ${stats.maxPriceAed.toLocaleString("en-AE")}`
              : ""
          }`}
        />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <h2 className="text-xl font-semibold text-slate">Model this project</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate/60">
          Yield strategy, five-year hold, and payment plan, run against this
          project&apos;s own unit types and prices.
        </p>
        <div className="mt-6">
          <DevelopmentAnalytics
            properties={development.properties}
            defaultPaymentStructureId={slug === "wadeem-gardens" ? "wadeem-adib" : "60-40"}
          />
        </div>
      </section>

      {meta?.siteplanImage && (
        <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
          <h2 className="text-xl font-semibold text-slate">Site plan</h2>
          <RevealImage
            src={meta.siteplanImage.src}
            alt={meta.siteplanImage.alt}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            containerClassName="relative mt-6 aspect-[16/9] w-full rounded-2xl shadow-card"
            className="object-cover"
          />
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <h2 className="text-xl font-semibold text-slate">Location</h2>
        <div className="mt-6">
          <LocationMap query={`${development.name}, ${development.city}`} />
        </div>
      </section>

      {/* Updates feed — honestly stubbed, no content source yet. */}
      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <h2 className="text-xl font-semibold text-slate">Project updates</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate/60">
          Construction and handover updates for this project will appear
          here once there is a source for them (agent-authored posts or a
          developer feed) — not built yet.
        </p>
      </section>

      <Footer />
    </main>
  );
}
