"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { pricePerSqft, type Property } from "@/lib/types";
import { unitLabel } from "@/lib/project-facts";
import { FormattedPrice } from "@/components/ui/FormattedPrice";
import { useSelectedUnit } from "@/components/ui/SelectedUnit";
import { WhatsAppLogo } from "@/components/ui/WhatsAppButton";
import { whatsAppUrlWithMessage } from "@/lib/site-config";

const isFloorPlan = (img: { alt: string }) => /floor ?plan/i.test(img.alt);

/** One tab per home in a project, cheapest first: photo, floor plan where
 * the developer published one, the numbers, and a way into the listing. */
export function UnitTypeTabs({ properties, project }: { properties: Property[]; project: string }) {
  const sorted = [...properties].sort((a, b) => a.priceAed - b.priceAed);
  const { home, setSlug } = useSelectedUnit(sorted);
  const slug = home.slug;
  const [view, setView] = useState<"photo" | "plan">("photo");
  const plan = home.gallery?.find(isFloorPlan);
  const shown = view === "plan" && plan ? plan : home.image;

  const facts = [
    { label: "Built-up", value: `${home.sqft.toLocaleString("en-AE")} sqft` },
    home.plotSqft ? { label: "Plot", value: `${home.plotSqft.toLocaleString("en-AE")} sqft` } : null,
    home.baths ? { label: "Bathrooms", value: home.baths } : null,
    { label: "Status", value: home.status === "off-plan" ? "Off-plan" : "Ready" },
  ].filter((f) => f !== null);

  return (
    <div>
      {sorted.length > 1 && (
        <div role="tablist" aria-label="Home type" className="flex flex-wrap gap-2">
          {sorted.map((p) => (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={p.slug === slug}
              onClick={() => {
                setSlug(p.slug);
                setView("photo");
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                p.slug === slug ? "liquid-pill text-white" : "liquid-glass-light btn-hover text-slate/75 hover:text-slate"
              }`}
            >
              {unitLabel(p, sorted)}
            </button>
          ))}
        </div>
      )}

      <div role="tabpanel" className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1.35fr_1fr] md:gap-10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-card">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={shown.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={shown.src}
                alt={shown.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className={view === "plan" && plan ? "object-contain p-4" : "object-cover"}
              />
            </motion.div>
          </AnimatePresence>
          {plan && (
            <div className="liquid-glass-light absolute bottom-3 left-3 flex gap-1 rounded-full p-1 text-xs font-medium">
              {(["photo", "plan"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={`rounded-full px-3 py-1.5 transition-colors ${view === v ? "liquid-pill text-white" : "text-slate/70"}`}
                >
                  {v === "photo" ? "Photo" : "Floor plan"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-medium text-slate/60">Price</p>
          <h3 className="mt-1 text-3xl font-semibold tabular-nums text-slate">
            <FormattedPrice amountAed={home.priceAed} compact={false} />
          </h3>
          <p className="mt-1 text-sm text-slate/60">
            <FormattedPrice amountAed={pricePerSqft(home)} compact={false} /> per sqft
          </p>
          <dl className="mt-5 divide-y divide-slate/10 border-y border-slate/10">
            {facts.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-slate/60">{f.label}</dt>
                <dd className="text-right text-sm font-semibold tabular-nums text-slate">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-auto md:pt-6">
            <Link
              href={`/properties/${home.slug}`}
              className="liquid-pill btn-hover group relative inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white"
            >
              See this home{" "}
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsAppUrlWithMessage(`Hi Janvi, I'd like to know more about the ${home.title} at ${project}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-light btn-hover inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-slate"
            >
              <WhatsAppLogo className="h-4 w-4 text-[#25D366]" /> Ask Janvi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
