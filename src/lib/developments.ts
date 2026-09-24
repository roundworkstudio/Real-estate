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
      byKey.set(key, {
        slug: slugify(property.community),
        name: property.community,
        city: property.city,
        properties: [],
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
