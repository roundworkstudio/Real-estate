"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, ChevronLeft, ChevronRight, MapPin, MoveUpRight, Star } from "lucide-react";
import type { Property } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { FormattedPrice } from "@/components/ui/FormattedPrice";
import { CompareToggle } from "@/components/tools/CompareToggle";
import { WhatsAppLogo } from "@/components/ui/WhatsAppButton";
import { whatsAppUrlWithMessage } from "@/lib/site-config";

export function PropertyCard({
  property,
  featured = false,
  pickBelow = false,
}: {
  property: Property;
  featured?: boolean;
  /** Render Janvi's pick quote as a bubble under the card so card heights stay uniform. */
  pickBelow?: boolean;
}) {
  const images = property.gallery?.length ? property.gallery : [property.image];
  const href = `/properties/${property.slug}`;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };
  const go = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: (index + dir) * el.clientWidth, behavior: "smooth" });
  };

  const whatsAppHref = whatsAppUrlWithMessage(
    `Hi Janvi, I'm interested in the ${property.title} (${property.community}, ${property.city}). Could you share more details?`,
  );

  return (
    <article className={`group relative ${featured ? "md:col-span-2" : ""}`}>
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 shadow-[0_18px_45px_-28px_rgba(58,45,40,.65)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_25px_55px_-28px_rgba(58,45,40,.8)]">
        <div className={`relative overflow-hidden ${featured ? "aspect-[16/9] sm:aspect-[2/1]" : "aspect-[4/3]"}`}>
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          >
            {images.map((image, i) => (
              <Link
                key={`${image.src}-${i}`}
                href={href}
                tabIndex={i === 0 ? undefined : -1}
                aria-hidden={i === 0 ? undefined : true}
                aria-label={i === 0 ? property.title : undefined}
                className="relative h-full w-full shrink-0 snap-center snap-always"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={featured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate/85 via-slate/25 via-35% to-transparent" />
          <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap items-center gap-1.5">
            <StatusBadge status={property.status} />
            {property.janvisPick && (
              <span className="inline-flex items-center gap-1 rounded-full bg-royal-deep/90 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                <Star size={11} className="fill-current" /> Janvi&apos;s pick
              </span>
            )}
          </div>
          <div className="pointer-events-none absolute bottom-7 left-4 right-4 text-white">
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-slate/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
              <MapPin size={12} /> {property.community}, {property.city}
            </div>
            <h3 className={`${featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"} font-semibold leading-tight [text-shadow:0_1px_12px_rgb(0_0_0/0.35)]`}>
              {property.title}
            </h3>
          </div>
          {images.length > 1 && (
            <>
              <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1" aria-hidden>
                {images.map((image, i) => (
                  <span
                    key={`${image.src}-dot-${i}`}
                    className={`h-1.5 rounded-full bg-white transition-all duration-300 ${i === index ? "w-4 opacity-100" : "w-1.5 opacity-50"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => go(-1)}
                disabled={index === 0}
                className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate opacity-0 shadow-sm backdrop-blur-sm transition hover:bg-white group-hover:opacity-100 disabled:!opacity-0 sm:flex"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => go(1)}
                disabled={index === images.length - 1}
                className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate opacity-0 shadow-sm backdrop-blur-sm transition hover:bg-white group-hover:opacity-100 disabled:!opacity-0 sm:flex"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
        <div className="relative px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-semibold text-slate">
                <Link href={href} tabIndex={-1} className="after:absolute after:inset-0 after:content-['']">
                  <FormattedPrice amountAed={property.priceAed} />
                </Link>
              </p>
              <p className="mt-1 text-xs text-slate/70">
                {property.beds} bedrooms · {property.sqft.toLocaleString("en-AE")} sqft
              </p>
              {property.developer && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-slate/10 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate/70">
                  <Building2 size={11} /> {property.developer}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ask Janvi about ${property.title} on WhatsApp`}
                title="Ask Janvi on WhatsApp"
                className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E] transition hover:bg-[#25D366] hover:text-white"
              >
                <WhatsAppLogo className="h-5 w-5" />
              </a>
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-slate transition group-hover:bg-royal group-hover:text-white"
                aria-hidden
              >
                <MoveUpRight size={17} />
              </span>
            </div>
          </div>
          {property.janvisPick && !pickBelow && (
            <div className="mt-3 flex items-start gap-2.5 border-t border-slate/10 pt-3">
              <Image
                src="/media/people/janvi-about.jpg"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 shrink-0 rounded-full object-cover object-top"
              />
              <p className="text-xs italic leading-relaxed text-slate/70">
                &ldquo;{property.janvisPick}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
      {property.janvisPick && pickBelow && (
        <figure className="relative mx-4 mt-4 flex items-start gap-2.5 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(58,45,40,.6)] backdrop-blur-sm">
          <span
            aria-hidden
            className="absolute -top-[7px] left-8 h-3 w-3 rotate-45 rounded-tl-[3px] border-l border-t border-white/80 bg-white/70"
          />
          <Image
            src="/media/people/janvi-about.jpg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-full object-cover object-top"
          />
          <div>
            <blockquote className="text-xs italic leading-relaxed text-slate/75">
              &ldquo;{property.janvisPick}&rdquo;
            </blockquote>
            <p className="mt-1 text-[11px] font-medium text-slate/70">Janvi</p>
          </div>
        </figure>
      )}
      <CompareToggle slug={property.slug} className="absolute right-4 top-4 z-10" />
    </article>
  );
}
