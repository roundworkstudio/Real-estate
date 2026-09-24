"use client";

import Image from "next/image";
import type { Development, DevelopmentStats } from "@/lib/developments";
import { GlassCard } from "./GlassCard";
import { useInView } from "@/lib/motion";

/** Rounded end to end, photo and text panel as one continuous shape —
 * same explicit override of anti-slop-ui.md's "no card for listings" rule
 * as PropertyCard now carries; see that component's note. GlassCard gives
 * the whole card the 3D tilt + glass sheen + pane edge. */
export function DevelopmentCard({
  development,
  stats,
}: {
  development: Development;
  stats: DevelopmentStats;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const cover = development.meta?.heroImage ?? development.properties[0].image;
  const priceRange =
    stats.minPriceAed === stats.maxPriceAed
      ? `AED ${stats.minPriceAed.toLocaleString("en-AE")}`
      : `AED ${stats.minPriceAed.toLocaleString("en-AE")} – ${stats.maxPriceAed.toLocaleString("en-AE")}`;

  return (
    <a href={`/developments/${development.slug}`} className="hover-lift group block">
      <GlassCard className="overflow-hidden rounded-2xl bg-canvas shadow-card" maxDeg={5}>
        <div ref={ref} className="relative aspect-[16/10] overflow-hidden bg-sand">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
              inView ? "scale-100" : "scale-[1.08]"
            }`}
          />
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-semibold text-slate">{development.name}</span>
            <span className="text-sm text-slate/60">
              {stats.unitCount} {stats.unitCount === 1 ? "listing" : "listings"}
            </span>
          </div>
          <div className="mt-1 text-sm text-slate/60">
            {development.city} · {priceRange}
          </div>
        </div>
      </GlassCard>
    </a>
  );
}
