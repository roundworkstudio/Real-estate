"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/ui/PropertyCard";
import type { Property, PropertyStatus, PropertyStrategy } from "@/lib/types";

const strategyLabels: Record<PropertyStrategy, string> = { yield: "Yield", "off-plan": "Off-plan", "value-add": "Value-add", str: "Short stay", commercial: "Commercial" };
const statusLabels: Record<PropertyStatus, string> = { new: "New", "under-offer": "Under offer", sold: "Sold", "off-plan": "Off-plan" };

function FilterPill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-royal-deep text-white shadow-sm" : "bg-white/70 text-slate/65 hover:bg-white"}`}>{children}</button>;
}

export function PortfolioFilters({ properties }: { properties: Property[] }) {
  const [strategy, setStrategy] = useState<PropertyStrategy | "all">("all");
  const [status, setStatus] = useState<PropertyStatus | "all">("all");
  const [community, setCommunity] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const communities = useMemo(() => Array.from(new Set(properties.map((p) => p.community))), [properties]);
  const filtered = properties.filter((p) => {
    const text = `${p.title} ${p.community} ${p.city}`.toLowerCase();
    return (strategy === "all" || p.strategy === strategy) && (status === "all" || p.status === status) && (community === "all" || p.community === community) && (!query || text.includes(query.toLowerCase()));
  });

  return (
    <div>
      <div className="rounded-[2rem] border border-white/70 bg-mist/55 p-3 shadow-[0_18px_45px_-35px_rgba(58,45,40,.7)] sm:p-4">
        <div className="flex gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/80 px-4 py-3 text-slate/55"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search homes, communities..." className="min-w-0 flex-1 bg-transparent text-sm text-slate outline-none placeholder:text-slate/45" /></label>
          <button type="button" aria-label="Show filters" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-slate transition hover:bg-white"><SlidersHorizontal size={18} /></button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar"><FilterPill active={strategy === "all"} onClick={() => setStrategy("all")}>All homes</FilterPill>{Array.from(new Set(properties.map((p) => p.strategy))).map((value) => <FilterPill key={value} active={strategy === value} onClick={() => setStrategy(value)}>{strategyLabels[value]}</FilterPill>)}</div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar"><FilterPill active={community === "all"} onClick={() => setCommunity("all")}>All locations</FilterPill>{communities.map((value) => <FilterPill key={value} active={community === value} onClick={() => setCommunity(value)}>{value}</FilterPill>)}{Array.from(new Set(properties.map((p) => p.status))).map((value) => <FilterPill key={value} active={status === value} onClick={() => setStatus(value)}>{statusLabels[value]}</FilterPill>)}</div>
      </div>
      <div className="mt-10 flex items-end justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-royal">Curated for you</p><h2 className="mt-1 text-2xl font-semibold text-slate sm:text-3xl">Top properties</h2></div><span className="text-sm text-slate/50">{filtered.length} results</span></div>
      {filtered.length === 0 ? <div className="py-16 text-center text-sm text-slate/50">No listings match — try a different filter.</div> : <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((property, index) => <PropertyCard key={property.slug} property={property} featured={index === 0} />)}</div>}
    </div>
  );
}
