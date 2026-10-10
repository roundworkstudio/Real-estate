/**
 * Shared "table" style for label/value data lists — a label left, a
 * right-aligned tabular-numeral value, a hairline divider between rows
 * (none on the last one). No literal `<table>` anywhere on this site;
 * this is the closest thing to one, and the pattern this project reaches
 * for whenever data needs to read as a clean, scannable list rather than
 * prose or a stat tile.
 *
 * Extracted 2026-09-27 (explicit request — "clean, easily digestible"
 * tabular data, applied consistently); also applied to
 * PaymentPlanCalculator's fee list, which was the same row layout minus
 * the dividers.
 */
export function DataRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "accent";
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-slate/10 py-3 text-sm last:border-0">
      <span className="text-slate/60">{label}</span>
      <span
        className={`font-medium tabular-nums ${tone === "accent" ? "text-sovereign" : "text-slate"}`}
      >
        {value}
      </span>
    </div>
  );
}
