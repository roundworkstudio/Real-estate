import type { PropertyStatus } from "@/lib/types";

/**
 * Status badges only — per directives/anti-slop-ui.md, badges must carry
 * real state, never decoration. These four are the ones the directive
 * explicitly allows.
 */
const labels: Record<PropertyStatus, string> = {
  new: "New",
  "under-offer": "Under offer",
  sold: "Sold",
  "off-plan": "Off-plan",
};

/* "new"'s text is --color-slate rather than --color-sovereign deliberately
 * — a "royal blue + forest" swap this session paired --color-mist and
 * --color-sovereign so close in lightness (contrast ratio ~1.08, should be
 * ≥4.5) that the badge text was effectively invisible. --color-slate is
 * the one token every palette swap has kept genuinely dark, so it's the
 * only text colour here safe to pair with an arbitrary --color-mist
 * without re-checking contrast on every future swap. */
const tones: Record<PropertyStatus, string> = {
  new: "bg-mist/50 text-slate",
  "under-offer": "bg-royal/10 text-royal",
  sold: "bg-slate/10 text-slate",
  "off-plan": "bg-sand text-slate",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[status]}`}
    >
      {labels[status]}
    </span>
  );
}
