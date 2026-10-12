import type { Development } from "@/lib/developments";
import { developmentStats } from "@/lib/developments";
import { bedRange, builtPercent, handoverShort } from "@/lib/project-facts";
import { FormattedPrice } from "@/components/ui/FormattedPrice";

export function SampleChip({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className={`ml-1 rounded-full px-1.5 py-px align-middle text-[9px] font-medium ${onDark ? "bg-white/15 text-white/80" : "bg-slate/10 text-slate/70"}`}>
      Sample
    </span>
  );
}

/**
 * The two rows of project facts shared by the Projects card and the
 * project page hero: what you can buy, then where the build stands.
 */
export function ProjectStats({
  development,
  onDark = false,
  className = "",
}: {
  development: Development;
  onDark?: boolean;
  className?: string;
}) {
  const stats = developmentStats(development);
  const built = builtPercent(development);
  const divide = onDark ? "divide-white/20 border-white/20" : "divide-slate/10 border-slate/10";
  const label = `text-[11px] ${onDark ? "text-white/75" : "text-slate/70"}`;
  const value = `mt-0.5 text-sm font-semibold ${onDark ? "text-white" : "text-slate"}`;

  const rows: { label: string; value: React.ReactNode }[][] = [
    [
      { label: "From", value: <FormattedPrice amountAed={stats.minPriceAed} /> },
      { label: "Bedrooms", value: bedRange(development) },
      { label: "Listed", value: `${stats.unitCount} ${stats.unitCount === 1 ? "home" : "homes"}` },
    ],
    [
      { label: "Handover", value: handoverShort(development) },
      {
        label: "Built",
        value: built ? (
          <>
            {built.percent}%
            {built.isSample && <SampleChip onDark={onDark} />}
          </>
        ) : "TBC",
      },
      { label: "Per sqft", value: <FormattedPrice amountAed={stats.avgPricePerSqftAed} compact={false} /> },
    ],
  ];

  return (
    <div className={className}>
      {rows.map((row, r) => (
        <dl key={r} className={`grid grid-cols-3 divide-x text-center ${divide} ${r > 0 ? "mt-3 border-t pt-3" : ""}`}>
          {row.map((cell, c) => (
            <div key={cell.label} className={c === 0 ? "pr-2" : c === 1 ? "px-2" : "pl-2"}>
              <dt className={label}>{cell.label}</dt>
              <dd className={value}>{cell.value}</dd>
            </div>
          ))}
        </dl>
      ))}
    </div>
  );
}
