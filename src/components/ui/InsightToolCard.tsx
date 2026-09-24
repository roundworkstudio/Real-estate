import type { LucideIcon } from "lucide-react";

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
 */
export function InsightToolCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="hover-lift flex flex-col justify-between rounded-2xl bg-canvas shadow-card">
      <div className="p-4">
        <div className="flex h-32 items-center justify-center rounded-xl bg-royal shadow-[0_10px_15px_-3px_rgba(107,142,78,0.4),0_4px_6px_-4px_rgba(107,142,78,0.4)]">
          <Icon size={32} className="text-white" strokeWidth={1.75} />
        </div>
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
    </div>
  );
}
