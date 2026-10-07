"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { X } from "lucide-react";
import { COMPARE_LIMIT, useCompare } from "@/lib/compare-context";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { FormattedPrice } from "@/components/ui/FormattedPrice";
import { StatusBadge } from "@/components/ui/Badge";
import { pricePerSqft } from "@/lib/types";

export function CompareBar() {
  const { properties, toggle, clear, open, setOpen } = useCompare();
  const showDialog = open && properties.length > 0;

  useEffect(() => {
    if (!showDialog) return;
    lockScroll();
    return unlockScroll;
  }, [showDialog]);

  if (properties.length === 0) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 md:bottom-6">
        <div className="pointer-events-auto flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-white/70 bg-canvas/95 p-3 shadow-[0_18px_45px_-28px_rgba(58,45,40,.65)]">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
            {properties.map((property) => {
              const image = property.gallery?.[0] ?? property.image;
              return (
                <div
                  key={property.slug}
                  className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl"
                >
                  <Image
                    src={image.src}
                    alt={property.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${property.title} from compare`}
                    onClick={() => toggle(property.slug)}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate/80 text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              );
            })}
            <span className="shrink-0 text-xs text-slate/55">
              {properties.length}/{COMPARE_LIMIT}
            </span>
          </div>
          <button
            type="button"
            onClick={clear}
            className="shrink-0 text-xs font-medium text-slate/55 hover:text-slate"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={properties.length < 2}
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-full bg-royal-deep px-4 py-2 text-xs font-medium text-white disabled:opacity-40"
          >
            Compare
          </button>
        </div>
      </div>

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-slate/40 p-3"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Compare properties"
            data-lenis-prevent
            onClick={(event) => event.stopPropagation()}
            className="no-scrollbar max-h-[90dvh] w-full max-w-5xl overflow-auto overscroll-contain rounded-[1.75rem] border border-white/80 bg-canvas p-4 shadow-[0_24px_80px_-30px_rgba(46,36,32,.45)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate sm:text-2xl">
                  Compare properties
                </h2>
                <p className="mt-1 text-sm text-slate/55">
                  Side by side on current sample inventory.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close compare"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className={`mt-5 grid gap-2 sm:mt-8 sm:gap-4 ${
                properties.length === 2 ? "grid-cols-2" : "grid-cols-3"
              }`}
            >
              {properties.map((property) => {
                const image = property.gallery?.[0] ?? property.image;
                return (
                  <article
                    key={property.slug}
                    className="overflow-hidden rounded-2xl border border-slate/10 bg-white/60"
                  >
                    <div className="relative aspect-square sm:aspect-[4/3]">
                      <Image
                        src={image.src}
                        alt={property.title}
                        fill
                        sizes="(min-width: 640px) 33vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2 p-2.5 sm:space-y-3 sm:p-4">
                      <StatusBadge status={property.status} />
                      <h3 className="line-clamp-2 min-h-[2lh] text-xs font-semibold text-slate sm:min-h-0 sm:text-base">
                        {property.title}
                      </h3>
                      <p className="hidden text-sm text-slate/55 sm:block">
                        {property.community}, {property.city}
                      </p>
                      <dl className="space-y-2 text-xs sm:text-sm">
                        {[
                          {
                            label: "Price",
                            value: <FormattedPrice amountAed={property.priceAed} />,
                          },
                          { label: "Beds", value: property.beds },
                          {
                            label: "Size",
                            value: `${property.sqft.toLocaleString("en-AE")} sqft`,
                          },
                          {
                            label: "Price / sqft",
                            value: (
                              <FormattedPrice
                                amountAed={pricePerSqft(property)}
                                compact={false}
                              />
                            ),
                          },
                          {
                            label: "Gross yield",
                            value:
                              property.grossYield === null
                                ? "—"
                                : `${(property.grossYield * 100).toFixed(1)}%`,
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex flex-col sm:flex-row sm:justify-between sm:gap-3"
                          >
                            <dt className="text-[11px] text-slate/55 sm:text-sm">
                              {row.label}
                            </dt>
                            <dd className="font-medium text-slate">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <Link
                        href={`/properties/${property.slug}`}
                        onClick={() => setOpen(false)}
                        className="inline-flex text-xs font-medium text-royal hover:underline sm:text-sm"
                      >
                        View listing
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
