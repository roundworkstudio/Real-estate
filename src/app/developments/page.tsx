/**
 * Developments index — groups current listings by project. SITEMAP.md
 * plans `/developments/[slug]` but not an index; adding one here since
 * browsing by project is the actual ask, same "not yet in SITEMAP.md, flag
 * it" pattern as /invest and /analytics.
 *
 * Redesigned 2026-09-24 from a plain title + small card grid to a
 * full-bleed hero and alternating editorial rows — the small-card version
 * read as an afterthought next to the rest of the site's photography-led
 * pages. Each row alternates image side and Reveal direction (left/right,
 * not just fade-up) purely for rhythm across the two rows that exist
 * today; with more projects it naturally continues alternating.
 */
import Image from "next/image";
import { developments, developmentStats } from "@/lib/developments";
import { RevealImage } from "@/components/ui/RevealImage";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { ImageBreak } from "@/components/ui/ImageBreak";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

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
              "linear-gradient(to top, rgb(0 0 0 / 0.65), rgb(0 0 0 / 0.05) 55%)",
          }}
        />
        <Nav />
        <div className="relative px-6 pb-10 sm:px-10 sm:pb-14">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Projects</h1>
          <p className="mt-3 max-w-lg text-white/80">
            Current listings grouped by development, with project-level
            figures pulled live from the listings in each one.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        {developments.map((d, i) => {
          const stats = developmentStats(d);
          const cover = d.meta?.heroImage ?? d.properties[0].image;
          const priceRange =
            stats.minPriceAed === stats.maxPriceAed
              ? `AED ${stats.minPriceAed.toLocaleString("en-AE")}`
              : `AED ${stats.minPriceAed.toLocaleString("en-AE")} – ${stats.maxPriceAed.toLocaleString("en-AE")}`;
          const imageFirst = i % 2 === 0;

          return (
            <div key={d.slug}>
              {i > 0 && (
                <ImageBreak
                  src={d.properties[0].gallery?.[2]?.src ?? cover.src}
                  alt={d.properties[0].gallery?.[2]?.alt ?? cover.alt}
                  eyebrow={developments[i - 1].city}
                  value={`${stats.unitCount + developmentStats(developments[i - 1]).unitCount} listings`}
                  label="across current projects"
                />
              )}

              <section className="grid grid-cols-1 items-center gap-8 py-14 sm:grid-cols-2 sm:gap-12">
                <Reveal
                  direction={imageFirst ? "left" : "right"}
                  className={imageFirst ? "sm:order-1" : "sm:order-2"}
                >
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
                </Reveal>

                <Reveal
                  direction={imageFirst ? "right" : "left"}
                  delayMs={100}
                  className={imageFirst ? "sm:order-2" : "sm:order-1"}
                >
                  {d.meta && (
                    <div className="text-sm font-medium text-slate/50">{d.meta.developer}</div>
                  )}
                  <h2 className="mt-1 text-2xl font-semibold text-slate sm:text-3xl">
                    {d.name}
                  </h2>
                  <div className="mt-1 text-slate/60">{d.city}</div>
                  {d.meta && (
                    <p className="mt-4 max-w-md text-sm text-slate/70">{d.meta.description}</p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-sand px-3.5 py-1.5 text-sm text-slate">
                      {stats.unitCount} {stats.unitCount === 1 ? "listing" : "listings"}
                    </span>
                    <span className="rounded-full bg-sand px-3.5 py-1.5 text-sm text-slate">
                      {priceRange}
                    </span>
                    {stats.avgGrossYieldPercent !== null && (
                      <span className="rounded-full bg-sovereign/10 px-3.5 py-1.5 text-sm font-medium text-sovereign">
                        {stats.avgGrossYieldPercent.toFixed(1)}% avg. yield
                      </span>
                    )}
                  </div>

                  <a
                    href={`/developments/${d.slug}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-royal px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-royal/90"
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
