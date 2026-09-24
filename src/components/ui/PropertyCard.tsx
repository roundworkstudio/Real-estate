"use client";

import Image from "next/image";
import type { Property } from "@/lib/types";
import { pricePerSqft } from "@/lib/types";
import { StatusBadge } from "./Badge";
import { useInView, useTilt3D } from "@/lib/motion";

/**
 * Full-bleed photography, type-led separation below it — not a bordered
 * white card with a shadow. See directives/anti-slop-ui.md's real-estate
 * table: "Every listing in a rounded white card" is the slop pattern this
 * avoids.
 *
 * The thumbnail scales 1.08 → 1.00 on scroll reveal (once, via useInView)
 * layered on top of the existing hover-zoom (group-hover:scale-105) —
 * both are Tailwind scale utilities on the same element, composed through
 * the shared --tw-scale custom properties, so they don't fight each other:
 * whichever rule's selector is active (base/reveal vs. :hover) wins.
 * `.hover-lift` on the card itself adds the translateY lift, suppressed
 * while scrolling — see globals.css.
 *
 * The photo frame also gets a 3D tilt + glass sheen on hover (lib/motion.ts's
 * useTilt3D) — no border or background box added, so it stays within
 * anti-slop-ui.md's "no card" rule for listings; the photo itself becomes
 * the "glass window", not a card wrapped around it. useInView and
 * useTilt3D both need a ref on the same frame div, so their refs are
 * merged via a callback ref rather than picking one.
 */
export function PropertyCard({ property }: { property: Property }) {
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>();
  const tiltRef = useTilt3D<HTMLDivElement>(6);

  return (
    <a href={`/properties/${property.slug}`} className="hover-lift group block">
      <div
        ref={(node) => {
          inViewRef.current = node;
          tiltRef.current = node;
        }}
        className="glass-tilt relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand"
      >
        <Image
          src={property.image.src}
          alt={property.image.alt}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className={`object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
            inView ? "scale-100" : "scale-[1.08]"
          }`}
        />
        <div className="glass-sheen" />
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
        {property.community}, {property.city} · {property.beds} bed
        {property.baths !== undefined && ` · ${property.baths} bath`} ·{" "}
        {property.sqft.toLocaleString("en-AE")} sqft · AED{" "}
        {pricePerSqft(property).toLocaleString("en-AE")}/sqft
      </div>
    </a>
  );
}
