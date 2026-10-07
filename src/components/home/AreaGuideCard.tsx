"use client";

import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { FormattedPrice } from "@/components/ui/FormattedPrice";

export type AreaGuide = {
  name: string;
  city: string;
  image: string;
  imageAlt: string;
  yieldRange: string;
  priceFromAed: number;
  tag: string;
  description: string;
};

export function AreaGuideCard({ area }: { area: AreaGuide }) {
  return (
    <GlassCard className="group h-full min-h-[390px] overflow-hidden rounded-2xl shadow-card">
      <Image
        src={area.image}
        alt={area.imageAlt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 88vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div
        className="absolute inset-0 bg-[#e4d1bd]/80"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full min-h-[390px] flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-slate">{area.name}</div>
            <div className="mt-0.5 text-xs font-medium uppercase tracking-[0.16em] text-slate/55">
              {area.city}
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-slate/10 bg-canvas/65 px-2.5 py-1 text-xs font-medium text-slate/75">
            {area.tag}
          </span>
        </div>

        <div className="mt-auto rounded-xl border border-white/35 bg-canvas/55 p-4 shadow-sm">
          <p className="text-sm leading-relaxed text-slate/75">
            {area.description}
          </p>
          <div className="mt-4 flex items-center gap-6 border-t border-slate/10 pt-4">
            <div>
              <div className="text-xs text-slate/55">Gross yield</div>
              <div className="mt-0.5 text-sm font-semibold text-sovereign">
                {area.yieldRange}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate/55">From</div>
              <div className="mt-0.5 text-sm font-semibold text-slate">
                <FormattedPrice amountAed={area.priceFromAed} compact={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
