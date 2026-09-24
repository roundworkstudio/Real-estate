/**
 * Developments (projects) — SITEMAP.md already plans `/developments/[slug]`
 * ("Development page, shared updates feed"), just not built yet. There is
 * no separate "development" entity in the data model — the sample
 * properties only carry `community` — so this groups Property by
 * community + city rather than inventing a new field ahead of real data.
 * Once a real listings source exists, a development is likely its own
 * record (with its own description/amenities/handover date); this module
 * is the seam to swap that in without touching page code, same rule as
 * the Property model itself (PROJECT-BRIEF.md).
 */
import { sampleProperties } from "./sample-properties";
import type { Property } from "./types";
import { pricePerSqft } from "./types";

export type Development = {
  slug: string;
  name: string;
  city: Property["city"];
  properties: Property[];
  /** Project-level metadata that doesn't belong on any single listing —
   * only populated where a real source (e.g. a developer brochure) exists.
   * Absent for community groupings with no such source (e.g. Ramhan
   * Island), which is why every field here is optional. */
  meta?: DevelopmentMeta;
};

export type DevelopmentMeta = {
  developer: string;
  heroImage: { src: string; alt: string };
  siteplanImage?: { src: string; alt: string };
  description: string;
  amenities: string[];
  /** Dates as shown in the source, with no year attached where the source
   * itself didn't state one — see the EOI timeline note in
   * app/developments/[slug]/page.tsx for why. */
  eoiTimeline?: { label: string; date: string }[];
};

/** Real project metadata, sourced from client-supplied developer packs —
 * keyed by development slug. Not derived from Property data because it
 * describes the project, not any one unit. See
 * sample-properties.ts's top-of-file comment for the Wadeem Gardens
 * sourcing note. */
const DEVELOPMENT_META: Record<string, DevelopmentMeta> = {
  "wadeem-gardens": {
    developer: "MODON",
    heroImage: {
      src: "/media/wadeem-gardens/hero.jpg",
      alt: "Aerial view of Wadeem Gardens villas along the Hudayriyat Island coastline",
    },
    siteplanImage: {
      src: "/media/wadeem-gardens/site-plan.jpg",
      alt: "Wadeem Precinct site plan, Hudayriyat Island",
    },
    description:
      "A villa community within MODON's Wadeem Precinct on Hudayriyat Island, Abu Dhabi. Buyers choose from 4, 5, or 6-bedroom villas, each available in a choice of two layouts and two architectural styles (Arabian or Modern).",
    amenities: [
      "Community pool and sun deck",
      "Outdoor gym",
      "Landscaped gardens",
      "Central 2.3km + 2.2km spine connecting the precinct to the waterfront",
      "Part of a wider precinct masterplan including a waterfront promenade and marina",
    ],
    eoiTimeline: [
      { label: "EOI starts", date: "18 Sep" },
      { label: "EOI ends", date: "28 Sep" },
      { label: "VIP sales", date: "29 Sep" },
      { label: "Sales launch", date: "1 Oct" },
    ],
  },
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const developments: Development[] = (() => {
  const byKey = new Map<string, Development>();
  for (const property of sampleProperties) {
    const key = `${property.community}__${property.city}`;
    if (!byKey.has(key)) {
      const slug = slugify(property.community);
      byKey.set(key, {
        slug,
        name: property.community,
        city: property.city,
        properties: [],
        meta: DEVELOPMENT_META[slug],
      });
    }
    byKey.get(key)!.properties.push(property);
  }
  return Array.from(byKey.values());
})();

export function getDevelopment(slug: string): Development | undefined {
  return developments.find((d) => d.slug === slug);
}

export type DevelopmentStats = {
  unitCount: number;
  minPriceAed: number;
  maxPriceAed: number;
  avgPricePerSqftAed: number;
  avgGrossYieldPercent: number | null;
};

/** Every figure here is a live computation over the development's own
 * listings, not a separate invented statistic — same honesty rule as the
 * rest of the site's real tools. */
export function developmentStats(d: Development): DevelopmentStats {
  const prices = d.properties.map((p) => p.priceAed);
  const pricesPerSqft = d.properties.map(pricePerSqft);
  const yields = d.properties
    .map((p) => p.grossYield)
    .filter((y): y is number => y !== null);

  return {
    unitCount: d.properties.length,
    minPriceAed: Math.min(...prices),
    maxPriceAed: Math.max(...prices),
    avgPricePerSqftAed: Math.round(
      pricesPerSqft.reduce((a, b) => a + b, 0) / pricesPerSqft.length,
    ),
    avgGrossYieldPercent:
      yields.length > 0
        ? (yields.reduce((a, b) => a + b, 0) / yields.length) * 100
        : null,
  };
}
