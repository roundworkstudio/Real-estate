import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";

/**
 * Adapted from a Uiverse.io card by Yaya12085 (solid header block, footer
 * action bar), recoloured to the matcha palette. Used to introduce the
 * Analytics & Insight Suite's own tools — one card per tool, linking down
 * to it on the page. Kept as an opaque bordered/shadowed card
 * deliberately: directives/anti-slop-ui.md bans that pattern for property
 * listings specifically (see PropertyCard's own note), but this isn't a
 * listing, it's a tool-navigation card, the same class of exception
 * Services' glass cards already have. The original's decorative footer
 * tag was dropped rather than filled with invented copy — the directive's
 * "every label must carry real meaning" rule — leaving just the one real
 * action, a jump link to the tool itself.
 *
 * GlassCard gives it the 3D tilt + glass sheen treatment — pointer-tracked
 * rotation and a moving highlight, on top of the shadow-card lift it
 * already had.
 *
 * The icon block's shadow was still `rgba(107,142,78,…)` — a green tint
 * left over from the Uiverse.io source, never actually recoloured despite
 * the rest of the card being adapted to this palette. Swapped 2026-09-27
 * for a plain neutral shadow, matching globals.css's own rule ("neutral
 * near-black only… a tinted shadow over the sand/canvas surfaces reads as
 * a colour halo, not shade").
 */
export function InsightToolCard({
  icon: Icon,
  title,
  description,
  href,
  imageSrc,
  imageAlt,
  areaGuideStyle = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  areaGuideStyle?: boolean;
}) {
  if (areaGuideStyle) {
    return (
      <GlassCard className="group h-full min-h-[390px] overflow-hidden rounded-2xl shadow-card">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 88vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-royal">
            <Icon size={40} className="text-white" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-[#e4d1bd]/80" aria-hidden="true" />

        <div className="relative z-10 flex h-full min-h-[390px] flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-slate">{title}</div>
              <div className="mt-0.5 text-xs font-medium uppercase tracking-[0.16em] text-slate/55">
                Investment tool
              </div>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate/10 bg-canvas/65 text-slate/70">
              <Icon size={17} strokeWidth={1.8} />
            </span>
          </div>

          <div className="mt-auto rounded-xl border border-white/35 bg-canvas/55 p-4 shadow-sm">
            <p className="text-sm leading-relaxed text-slate/75">
              {description}
            </p>
            <div className="mt-4 border-t border-slate/10 pt-4">
              <a
                href={href}
                className="inline-flex w-full items-center justify-center rounded-full bg-royal px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-royal/90"
              >
                Explore
              </a>
            </div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      className="metal-edge group flex flex-col justify-between overflow-hidden rounded-[28px] bg-canvas shadow-card"
    >
      <div className="p-4">
        {imageSrc ? (
          <div
            className="relative h-32 overflow-hidden rounded-[20px] bg-royal shadow-card"
          >
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              fill
              sizes="(max-width: 639px) calc(100vw - 80px), 30vw"
              className="object-cover transition-transform duration-700 ease-out sm:group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-[20px] bg-royal shadow-card">
            <Icon size={32} className="text-white" strokeWidth={1.75} />
          </div>
        )}
        <div className="mt-5 text-center">
          <div className="text-lg font-semibold text-slate">{title}</div>
          <p className="mt-2 text-sm text-slate/70">{description}</p>
        </div>
      </div>
      <div className="flex justify-center border-t border-slate/10 bg-royal/5 p-3">
        <a
          href={href}
          className="inline-flex w-full items-center justify-center rounded-full bg-royal px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-royal/90"
        >
          Explore
        </a>
      </div>
    </GlassCard>
  );
}
