"use client";

import { GitCompare } from "lucide-react";
import { COMPARE_LIMIT, useCompare } from "@/lib/compare-context";
import { cn } from "@/lib/utils";

export function CompareToggle({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const { has, toggle, slugs } = useCompare();
  const selected = has(slug);
  const full = !selected && slugs.length >= COMPARE_LIMIT;

  return (
    <button
      type="button"
      disabled={full}
      aria-pressed={selected}
      aria-label={
        selected
          ? "Remove from compare"
          : full
            ? `Compare is limited to ${COMPARE_LIMIT} properties`
            : "Add to compare"
      }
      title={
        full
          ? `You can compare up to ${COMPARE_LIMIT} properties`
          : selected
            ? "Remove from compare"
            : "Add to compare"
      }
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-canvas/85 text-slate shadow-sm backdrop-blur-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40",
        selected && "bg-royal text-white hover:bg-royal",
        className,
      )}
    >
      <GitCompare size={17} />
    </button>
  );
}
