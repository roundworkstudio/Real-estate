import Image from "next/image";
import type { Property } from "@/lib/types";
import { pricePerSqft } from "@/lib/types";
import { StatusBadge } from "./Badge";

/**
 * Full-bleed photography, type-led separation below it — not a bordered
 * white card with a shadow. See directives/anti-slop-ui.md's real-estate
 * table: "Every listing in a rounded white card" is the slop pattern this
 * avoids.
 */
export function PropertyCard({ property }: { property: Property }) {
  return (
    <a href={`/properties/${property.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
        <Image
          src={property.image.src}
          alt={property.image.alt}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={property.status} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
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
        {property.community}, {property.city} · {property.beds} bed ·{" "}
        {property.baths} bath · {property.sqft.toLocaleString("en-AE")} sqft ·
        AED {pricePerSqft(property).toLocaleString("en-AE")}/sqft
      </div>
    </a>
  );
}
