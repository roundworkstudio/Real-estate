"use client";

import Image from "next/image";
import type { Property } from "@/lib/types";
import { pricePerSqft } from "@/lib/types";
import { StatusBadge } from "./Badge";
import { GlassCard } from "./GlassCard";
import { useInView } from "@/lib/motion";

/**
 * Rounded end to end — photo and the text panel beneath it share one
 * continuous rounded shape, not a full-bleed photo with plain type
 * floating below it. This is an explicit, repeated override of
 * directives/anti-slop-ui.md's "no bordered card for listings" rule (the
 * same override CredibilityNumbers' stat cards already carry) — flagging
 * it here rather than quietly dropping the rule, since the directive
 * itself is still otherwise binding.
 *
 * GlassCard gives the whole thing the 3D tilt + glass sheen + glass-pane
 * edge, not just the photo — see that component's note.
 */
export function PropertyCard({ property }: { property: Property }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <a href={`/properties/${property.slug}`} className="hover-lift group block">
      <GlassCard className="overflow-hidden rounded-2xl bg-canvas shadow-card" maxDeg={5}>
        <div ref={ref} className="relative aspect-[3/4] overflow-hidden bg-sand">
          <Image
            src={property.image.src}
            alt={property.image.alt}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className={`object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
              inView ? "scale-100" : "scale-[1.08]"
            }`}
          />
          <div className="absolute left-3 top-3">
            <StatusBadge status={property.status} />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-semibold tabular-nums text-slate">
              AED {property.priceAed.toLocaleString("en-AE")}
            </span>
            {property.grossYield !== null && (
              <span className="text-sm font-medium tabular-nums text-sovereign">
                {(property.grossYield * 100).toFixed(1)}% yield
              </span>
            )}
          </div>
          <div className="mt-1 text-slate">{property.title}</div>
          <div className="mt-1 text-sm text-slate/60">
            {property.community}, {property.city} · {property.beds} bed
            {property.baths !== undefined && ` · ${property.baths} bath`} ·{" "}
            {property.sqft.toLocaleString("en-AE")} sqft · AED{" "}
            {pricePerSqft(property).toLocaleString("en-AE")}/sqft
          </div>
        </div>
      </GlassCard>
    </a>
  );
}
