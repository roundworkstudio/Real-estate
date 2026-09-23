import { StatFigure } from "@/components/ui/StatFigure";

/**
 * SITEMAP.md: "sales volume, transactions, years active, average days on
 * market. Real figures only, plain type, no cards, no icons."
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
    <section id="numbers" className="px-6 py-20 sm:px-10">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
        {stats.map((s) => (
          <StatFigure key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
