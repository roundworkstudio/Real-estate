"use client";

import { FluidSlider } from "@/components/motion/range-slider-fluid";

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
  compact = false,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  tone?: "dark" | "light";
  compact?: boolean;
}) {
  return <FluidSlider label={label} value={value} onValueChange={onChange} min={min} max={max} step={step} format={() => displayValue} tone={tone} compact={compact} />;
}
