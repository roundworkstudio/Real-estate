"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, MoveUpRight } from "lucide-react";
import type { Property } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { FormattedPrice } from "@/components/ui/FormattedPrice";
import { CompareToggle } from "@/components/tools/CompareToggle";

export function PropertyCard({
  property,
  featured = false,
  compactOnMobile: _compactOnMobile,
  minimal: _minimal,
}: {
  property: Property;
  featured?: boolean;
  compactOnMobile?: boolean;
  minimal?: boolean;
}) {
  const image = property.gallery?.[0] ?? property.image;

  return (
    <article className={`group relative ${featured ? "md:col-span-2" : ""}`}>
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 shadow-[0_18px_45px_-28px_rgba(58,45,40,.65)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_25px_55px_-28px_rgba(58,45,40,.8)]">
          <div
            className={`relative overflow-hidden ${featured ? "aspect-[16/9] sm:aspect-[2/1]" : "aspect-[4/3]"}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={
                featured
                  ? "(min-width: 1024px) 66vw, 100vw"
                  : "(min-width: 1024px) 33vw, 50vw"
              }
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate/80 via-slate/5 to-transparent" />
            <div className="absolute left-4 top-4">
              <StatusBadge status={property.status} />
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="mb-1 flex items-center gap-1.5 text-xs text-white/80">
                <MapPin size={13} /> {property.community}, {property.city}
              </div>
              <h3
                className={`${featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"} font-semibold leading-tight`}
              >
                {property.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
            <div>
              <p className="text-lg font-semibold text-slate">
                <FormattedPrice amountAed={property.priceAed} />
              </p>
              <p className="mt-1 text-xs text-slate/55">
                {property.beds} bedrooms · {property.sqft.toLocaleString("en-AE")}{" "}
                sqft
              </p>
            </div>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-slate transition group-hover:bg-royal group-hover:text-white"
              aria-hidden
            >
              <MoveUpRight size={17} />
            </span>
          </div>
        </div>
      </Link>
      <CompareToggle
        slug={property.slug}
        className="absolute right-4 top-4 z-10"
      />
    </article>
  );
}
