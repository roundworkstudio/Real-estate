"use client";

/**
 * Shared slider control for the analytics suite — same visual pattern as
 * InvestmentCalculator's inline one, extracted here since three more
 * components need it. Supports both the deep-panel (white-on-green) and
 * canvas (slate-on-oat) contexts already used across the site.
 */
export function RangeSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  displayValue,
  tone = "dark",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  tone?: "dark" | "light";
}) {
  const isDark = tone === "dark";
  return (
    <label className="block">
      <div className="flex items-baseline justify-between text-sm">
        <span className={isDark ? "text-white/70" : "text-slate/60"}>{label}</span>
        <span
          className={`font-medium tabular-nums ${isDark ? "text-white" : "text-slate"}`}
        >
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full ${
          isDark ? "bg-white/20 accent-white" : "bg-slate/15 accent-royal"
        }`}
      />
    </label>
  );
}
