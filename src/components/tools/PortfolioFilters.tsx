"use client";

import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Property, PropertyStatus, PropertyStrategy } from "@/lib/types";

const strategyLabels: Record<PropertyStrategy, string> = {
  yield: "High cash flow (yield)",
  "off-plan": "Capital appreciation (off-plan)",
  "value-add": "Value-add / renovation",
  str: "Short-term rental",
  commercial: "Commercial",
};

const statusLabels: Record<PropertyStatus, string> = {
  new: "New",
  "under-offer": "Under offer",
  sold: "Sold",
  "off-plan": "Off-plan",
};

function FilterGroup<T extends string>({
  label,
  options,
  optionLabels,
  active,
  onChange,
}: {
  label: string;
  options: T[];
  optionLabels: Record<T, string>;
  active: T | "all";
  onChange: (v: T | "all") => void;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate/40">
        {label}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          onClick={() => onChange("all")}
          className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
            active === "all"
              ? "bg-slate text-white"
              : "bg-slate/5 text-slate hover:bg-slate/10"
          }`}
        >
          All
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              active === opt
                ? "bg-slate text-white"
                : "bg-slate/5 text-slate hover:bg-slate/10"
            }`}
          >
            {optionLabels[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Strategy/status/geography filters over the real property inventory —
 * geography options are derived from the data itself, never a fixed list
 * of aspirational neighbourhoods, so the filter can never claim coverage
 * that doesn't exist yet. With two sample listings the demonstration is
 * necessarily thin; more chips appear automatically as real listings are
 * added, no code change needed.
 */
export function PortfolioFilters({ properties }: { properties: Property[] }) {
  const [strategy, setStrategy] = useState<PropertyStrategy | "all">("all");
  const [status, setStatus] = useState<PropertyStatus | "all">("all");
  const [community, setCommunity] = useState<string | "all">("all");

  const communities = useMemo(
    () => Array.from(new Set(properties.map((p) => p.community))),
    [properties],
  );
  const statuses = useMemo(
    () => Array.from(new Set(properties.map((p) => p.status))),
    [properties],
  );
  const strategies = useMemo(
    () => Array.from(new Set(properties.map((p) => p.strategy))),
    [properties],
  );

  const filtered = properties.filter(
    (p) =>
      (strategy === "all" || p.strategy === strategy) &&
      (status === "all" || p.status === status) &&
      (community === "all" || p.community === community),
  );

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-slate/10 pb-8 sm:flex-row sm:flex-wrap sm:gap-x-10">
        <FilterGroup
          label="Strategy"
          options={strategies}
          optionLabels={strategyLabels}
          active={strategy}
          onChange={setStrategy}
        />
        <FilterGroup
          label="Status"
          options={statuses}
          optionLabels={statusLabels}
          active={status}
          onChange={setStatus}
        />
        <FilterGroup
          label="Community"
          options={communities}
          optionLabels={Object.fromEntries(communities.map((c) => [c, c]))}
          active={community}
          onChange={setCommunity}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate/50">
          No listings match — try a different filter.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delayMs={(i % 3) * 100}>
              <PropertyCard property={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
