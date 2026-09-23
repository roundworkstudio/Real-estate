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

const tones: Record<PropertyStatus, string> = {
  new: "bg-sovereign/10 text-sovereign",
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
