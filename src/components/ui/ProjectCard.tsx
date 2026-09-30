"use client";

import Image from "next/image";
import type { Development, DevelopmentStats } from "@/lib/developments";
import { GlassCard } from "./GlassCard";
import { useInView } from "@/lib/motion";

/**
 * Homepage/project-index card — same rounded-end-to-end, GlassCard-tilt
 * treatment as PropertyCard (see that component's note on why: an
 * explicit, repeated override of anti-slop-ui.md's "no bordered card for
 * listings" rule). A near-identical component, `DevelopmentCard`, existed
 * earlier and was deleted as dead code once `/developments` moved to a
 * full-bleed editorial layout with no card grid — this one has a real
 * caller again (FeaturedProjects, 2026-09-27) since the homepage now
 * features projects instead of individual listings.
 */
export function ProjectCard({
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
      : `AED ${(stats.minPriceAed / 1_000_000).toFixed(1)}m – ${(stats.maxPriceAed / 1_000_000).toFixed(1)}m`;

  return (
    <a href={`/developments/${development.slug}`} className="hover-lift group block">
      <GlassCard className="overflow-hidden rounded-2xl bg-canvas shadow-card" maxDeg={5}>
        <div ref={ref} className="relative aspect-[4/3] overflow-hidden bg-sand">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, 50vw"
            className={`object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
              inView ? "scale-100" : "scale-[1.08]"
            }`}
          />
        </div>

        <div className="p-3 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
            <span className="text-sm font-semibold leading-snug text-slate sm:text-lg">
              {development.name}
            </span>
            <span className="mt-1 text-xs text-slate/60 sm:mt-0 sm:text-sm">
              {stats.unitCount} {stats.unitCount === 1 ? "listing" : "listings"}
            </span>
          </div>
          <div className="mt-1 text-xs leading-relaxed text-slate/60 sm:text-sm">
            {development.city} · {priceRange}
          </div>
        </div>
      </GlassCard>
    </a>
  );
}
