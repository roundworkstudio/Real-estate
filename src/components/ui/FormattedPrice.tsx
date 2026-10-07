"use client";

import { useCurrency } from "@/lib/currency-context";

export function FormattedPrice({
  amountAed,
  compact = true,
  className,
}: {
  amountAed: number;
  compact?: boolean;
  className?: string;
}) {
  const { format, formatCompact } = useCurrency();
  return (
    <span className={className}>
      {compact ? formatCompact(amountAed) : format(amountAed)}
    </span>
  );
}
