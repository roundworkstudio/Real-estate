import { StatFigure } from "@/components/ui/StatFigure";
import { Reveal } from "@/components/ui/Reveal";

/**
 * SITEMAP.md originally specced this as "plain type, no cards, no icons".
 * Overridden 2026-09-24 at explicit user request: each stat now sits in a
 * rounded square card with a shadow. SITEMAP.md not yet updated to match —
 * do that before calling this settled.
 *
 * PLACEHOLDER FIGURES — these are not real. They exist to hold the layout
 * and the typographic pattern (docs/what-worked.md) until Janvi supplies
 * her actual numbers. Do not present these to the client as real.
 */
const stats = [
  { label: "Transaction volume", value: 312, prefix: "AED", unit: "M" },
  { label: "Properties sold", value: 148 },
  { label: "Years active", value: 9 },
  { label: "Avg. days on market", value: 45, unit: "days" },
];

export function CredibilityNumbers() {
  return (
    <section id="numbers" className="scroll-mt-24 px-6 py-20 sm:px-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delayMs={i * 100}
            className="rounded-2xl bg-sand p-6 shadow-card sm:aspect-square sm:flex sm:flex-col sm:items-center sm:justify-center"
          >
            <StatFigure {...s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
