"use client";

import Image from "next/image";
import type { Development, DevelopmentStats } from "@/lib/developments";
import { useInView, useTilt3D } from "@/lib/motion";

/** Same full-bleed pattern as PropertyCard — no bordered card, per
 * directives/anti-slop-ui.md. Same reveal-scale + hover-lift + 3D tilt/
 * glass sheen treatment as PropertyCard — see that component's note for
 * how the scale transforms and the two refs (inView + tilt) compose. */
export function DevelopmentCard({
  development,
  stats,
}: {
  development: Development;
  stats: DevelopmentStats;
}) {
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>();
  const tiltRef = useTilt3D<HTMLDivElement>(6);
  const cover = development.meta?.heroImage ?? development.properties[0].image;
  const priceRange =
    stats.minPriceAed === stats.maxPriceAed
      ? `AED ${stats.minPriceAed.toLocaleString("en-AE")}`
      : `AED ${stats.minPriceAed.toLocaleString("en-AE")} – ${stats.maxPriceAed.toLocaleString("en-AE")}`;

  return (
    <a href={`/developments/${development.slug}`} className="hover-lift group block">
      <div
        ref={(node) => {
          inViewRef.current = node;
          tiltRef.current = node;
        }}
        className="glass-tilt relative aspect-[16/10] overflow-hidden rounded-2xl bg-sand"
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
            inView ? "scale-100" : "scale-[1.08]"
          }`}
        />
        <div className="glass-sheen" />
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
