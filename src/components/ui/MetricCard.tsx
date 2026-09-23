/**
 * Large-figure stat card. Per docs/what-worked.md, the one element that came
 * out right in the first attempt:
 *  - the number is the message, the unit is support (small, muted)
 *  - tabular figures so nothing reflows
 *  - the resting value lives in markup, correct even if no script runs
 * Counter animation (count-up on scroll, once per load) is not implemented
 * here — that is motion work, added once a real page exists to place it on.
 */
type MetricCardProps = {
  label: string;
  value: string;
  unit?: string;
  tone?: "default" | "positive";
};

export function MetricCard({
  label,
  value,
  unit,
  tone = "default",
}: MetricCardProps) {
  return (
    <div className="rounded-2xl bg-canvas p-6 shadow-card">
      <div className="text-sm text-slate/60">{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className={`text-4xl font-semibold tabular-nums ${
            tone === "positive" ? "text-sovereign" : "text-slate"
          }`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[0.44em] font-medium text-slate/60">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
