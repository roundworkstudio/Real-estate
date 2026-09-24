import Image from "next/image";
import type { Development, DevelopmentStats } from "@/lib/developments";

/** Same full-bleed pattern as PropertyCard — no bordered card, per
 * directives/anti-slop-ui.md. */
export function DevelopmentCard({
  development,
  stats,
}: {
  development: Development;
  stats: DevelopmentStats;
}) {
  const cover = development.properties[0].image;
  const priceRange =
    stats.minPriceAed === stats.maxPriceAed
      ? `AED ${stats.minPriceAed.toLocaleString("en-AE")}`
      : `AED ${stats.minPriceAed.toLocaleString("en-AE")} – ${stats.maxPriceAed.toLocaleString("en-AE")}`;

  return (
    <a href={`/developments/${development.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-sand">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-lg font-semibold text-slate">{development.name}</span>
        <span className="text-sm text-slate/60">
          {stats.unitCount} {stats.unitCount === 1 ? "listing" : "listings"}
        </span>
      </div>
      <div className="mt-1 text-sm text-slate/60">
        {development.city} · {priceRange}
      </div>
    </a>
  );
}
