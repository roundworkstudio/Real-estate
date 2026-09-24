/**
 * Single development (project) page — per SITEMAP.md's
 * `/developments/[slug]` ("Development page, shared updates feed"). The
 * updates feed itself is honestly stubbed, not faked: there's no content
 * source for project updates yet (no CMS, no agent-authored posts), same
 * treatment as the property page's location notes and similar-properties
 * section — see that page's top comment for the pattern this follows.
 */
import { notFound } from "next/navigation";
import { developments, getDevelopment, developmentStats } from "@/lib/developments";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { LocationMap } from "@/components/ui/LocationMap";
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

  return (
    <main>
      <div className="relative bg-slate">
        <Nav />
        <div className="h-20" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <h1 className="text-3xl font-semibold text-slate sm:text-4xl">
          {development.name}
        </h1>
        <div className="mt-1 text-lg text-slate/70">{development.city}</div>

        {/* Project insight — every figure computed live from the listings
            in this development, see lib/developments.ts. */}
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
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
