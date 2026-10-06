"use client";

import { useMemo, useState } from "react";
import { Building2, ChevronRight, CircleDollarSign, House, MapPin, Search, SlidersHorizontal, Sparkles, TrendingUp, X } from "lucide-react";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { FluidSlider } from "@/components/motion/range-slider-fluid";
import { Slider } from "@/components/ui/slider";
import type { Property, PropertyStatus, PropertyStrategy } from "@/lib/types";

const strategyLabels: Record<PropertyStrategy, string> = { yield: "Yield", "off-plan": "Off-plan", "value-add": "Value-add", str: "Short stay", commercial: "Commercial" };
const statusLabels: Record<PropertyStatus, string> = { new: "New", "under-offer": "Under offer", sold: "Sold", "off-plan": "Off-plan" };
type VisitorIntent = "all" | "buyer" | "investor";

function FilterPill({ active, children, icon, onClick, compact = false }: { active: boolean; children: React.ReactNode; icon?: React.ReactNode; onClick: () => void; compact?: boolean }) {
  return <button type="button" onClick={onClick} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/75 ${compact ? "px-2.5 py-1.5 text-xs" : "gap-2 px-3 py-2 text-sm"} font-medium shadow-[inset_0_1px_2px_rgba(255,255,255,.75)] backdrop-blur-md transition ${active ? "bg-royal-deep/90 text-white shadow-sm" : "bg-white/50 text-slate/65 hover:bg-white/75"}`}>
    {icon && <span className={`flex ${compact ? "h-5 w-5" : "h-6 w-6"} items-center justify-center rounded-full ${active ? "bg-white/15 text-white" : "bg-white/70 text-royal-deep/70"}`}>{icon}</span>}
    {children}
  </button>;
}

function IntentTile({ active, title, icon, onClick }: { active: boolean; title: string; icon: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`flex h-full w-full aspect-square min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border p-2.5 text-center shadow-[inset_0_1px_2px_rgba(255,255,255,.8)] backdrop-blur-md transition ${active ? "border-royal-deep/30 bg-royal-deep text-white shadow-sm" : "border-white/80 bg-white/55 text-slate hover:bg-white/80"}`}>
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-white/15 text-white" : "bg-white/75 text-royal-deep"}`}>{icon}</span>
    <span className="block min-w-0 text-xs font-semibold leading-tight sm:text-sm">{title}</span>
  </button>;
}

export function PortfolioFilters({ properties }: { properties: Property[] }) {
  const [strategy, setStrategy] = useState<PropertyStrategy | "all">("all");
  const [status, setStatus] = useState<PropertyStatus | "all">("all");
  const [community, setCommunity] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [visitorIntent, setVisitorIntent] = useState<VisitorIntent>("all");
  const [minPriceAed, setMinPriceAed] = useState(500_000);
  const [maxPriceAed, setMaxPriceAed] = useState(15_000_000);
  const [minBeds, setMinBeds] = useState(1);
  const [maxBeds, setMaxBeds] = useState(8);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "beds-high">("featured");
  const communities = useMemo(() => Array.from(new Set(properties.map((p) => p.community))), [properties]);
  const sorted = useMemo(() => {
    const searchTerms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = properties.filter((property) => {
      const searchableText = [
        property.title,
        property.community,
        property.city,
        property.status,
        property.strategy,
        `${property.beds} bedroom`,
        `${property.sqft} sqft`,
      ].join(" ").toLowerCase();
      const matchesSearch = searchTerms.every((term) => searchableText.includes(term));
      const matchesIntent =
        visitorIntent === "all" ||
        (visitorIntent === "buyer" && property.strategy === "off-plan") ||
        (visitorIntent === "investor" && (property.grossYield !== null || property.strategy !== "off-plan"));

      return (
        matchesIntent &&
        (strategy === "all" || property.strategy === strategy) &&
        (status === "all" || property.status === status) &&
        (community === "all" || property.community === community) &&
        property.priceAed >= minPriceAed &&
        (maxPriceAed >= 15_000_000 || property.priceAed <= maxPriceAed) &&
        property.beds >= minBeds &&
        (maxBeds >= 8 || property.beds <= maxBeds) &&
        matchesSearch
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.priceAed - b.priceAed;
      if (sortBy === "price-high") return b.priceAed - a.priceAed;
      if (sortBy === "beds-high") return b.beds - a.beds;
      return 0;
    });
  }, [community, maxBeds, maxPriceAed, minBeds, minPriceAed, properties, query, sortBy, status, strategy, visitorIntent]);

  const resetFilters = () => {
    setStrategy("all");
    setStatus("all");
    setCommunity("all");
    setQuery("");
    setVisitorIntent("all");
    setMinPriceAed(500_000);
    setMaxPriceAed(15_000_000);
    setMinBeds(1);
    setMaxBeds(8);
    setSortBy("featured");
  };

  return (
    <div>
      <div className="rounded-[2rem] border border-white/80 bg-white/35 p-3 shadow-[0_18px_45px_-35px_rgba(58,45,40,.35)] backdrop-blur-md sm:p-4">
        <div className="flex gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/85 bg-white/60 px-4 py-3 text-slate/55 shadow-[inset_0_1px_2px_rgba(255,255,255,.85),0_5px_18px_rgba(58,45,40,.06)] backdrop-blur-md"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search homes, communities..." className="min-w-0 flex-1 bg-transparent text-sm text-slate outline-none placeholder:text-slate/45" /></label>
          <button type="button" aria-label="Show more filters" aria-expanded={showMoreFilters} onClick={() => setShowMoreFilters(true)} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/85 text-slate shadow-[inset_0_1px_2px_rgba(255,255,255,.85),0_5px_18px_rgba(58,45,40,.06)] backdrop-blur-md transition hover:bg-white/80 ${showMoreFilters ? "bg-royal-deep text-white" : "bg-white/60"}`}><SlidersHorizontal size={18} /></button>
        </div>
        <div className="relative mt-3"><div className="flex gap-2 overflow-x-auto pb-1 pr-8 no-scrollbar"><FilterPill icon={<House size={13} />} active={strategy === "all"} onClick={() => setStrategy("all")}>All homes</FilterPill>{Array.from(new Set(properties.map((p) => p.strategy))).map((value) => <FilterPill key={value} icon={value === "yield" ? <TrendingUp size={13} /> : <Building2 size={13} />} active={strategy === value} onClick={() => setStrategy(value)}>{strategyLabels[value]}</FilterPill>)}</div><div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end bg-gradient-to-l from-white/70 via-white/45 to-transparent pl-3 text-royal"><ChevronRight size={16} /></div></div>
        <div className="relative mt-2"><div className="flex gap-2 overflow-x-auto pb-1 pr-8 no-scrollbar"><FilterPill icon={<MapPin size={13} />} active={community === "all"} onClick={() => setCommunity("all")}>All locations</FilterPill>{communities.map((value) => <FilterPill key={value} icon={<MapPin size={13} />} active={community === value} onClick={() => setCommunity(value)}>{value}</FilterPill>)}{Array.from(new Set(properties.map((p) => p.status))).map((value) => <FilterPill key={value} icon={value === "new" ? <Sparkles size={13} /> : value === "off-plan" ? <Building2 size={13} /> : <CircleDollarSign size={13} />} active={status === value} onClick={() => setStatus(value)}>{statusLabels[value]}</FilterPill>)}</div><div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end bg-gradient-to-l from-white/70 via-white/45 to-transparent pl-3 text-royal"><ChevronRight size={16} /></div></div>
        <div className="mt-2 flex items-center justify-end gap-1 pr-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate/40 sm:hidden"><span>Swipe for more</span><ChevronRight size={11} /></div>
      </div>
      {showMoreFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate/20 p-3 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onClick={() => setShowMoreFilters(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="more-filters-title" onClick={(event) => event.stopPropagation()} className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-[2rem] border border-white/85 bg-white/75 p-4 shadow-[0_24px_80px_-30px_rgba(46,36,32,.45)] backdrop-blur-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-5">
            <div className="flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-royal">Refine your search</p><h3 id="more-filters-title" className="mt-1 text-2xl font-semibold text-slate">More filters</h3></div><button type="button" aria-label="Close filters" onClick={() => setShowMoreFilters(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-slate transition hover:bg-white"><X size={18} /></button></div>
            <div className="mt-5 space-y-4">
              <div><p className="mb-2 text-sm font-medium text-slate">I’m looking to</p><div className="grid grid-cols-3 items-stretch gap-2"><IntentTile icon={<Building2 size={17} />} active={visitorIntent === "all"} onClick={() => setVisitorIntent("all")} title="All listings" /><IntentTile icon={<House size={17} />} active={visitorIntent === "buyer"} onClick={() => setVisitorIntent("buyer")} title="Buy a home" /><IntentTile icon={<TrendingUp size={17} />} active={visitorIntent === "investor"} onClick={() => setVisitorIntent("investor")} title="Invest" /></div></div>
              <label className="flex items-center justify-between gap-3 rounded-full border border-white/80 bg-white/60 px-3.5 py-2 text-xs font-medium text-slate shadow-[inset_0_1px_2px_rgba(255,255,255,.8)]"><span>Order listings</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="bg-transparent text-right text-xs font-medium text-royal-deep outline-none"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="beds-high">Most bedrooms</option></select></label>
              <div><p className="mb-2 text-sm font-medium text-slate">Price & location</p><div className="space-y-2"><div className="space-y-1"><FluidSlider className="h-10" min={500_000} max={15_000_000} step={100_000} value={minPriceAed} onValueChange={(value) => setMinPriceAed(Math.min(value, maxPriceAed))} aria-label="Minimum price" format={(value) => `Min AED ${(value / 1_000_000).toFixed(1)}m`} /><FluidSlider className="h-10" min={500_000} max={15_000_000} step={100_000} value={maxPriceAed} onValueChange={(value) => setMaxPriceAed(Math.max(value, minPriceAed))} aria-label="Maximum price" format={(value) => `Max AED ${value >= 15_000_000 ? "15.0m+" : `${(value / 1_000_000).toFixed(1)}m`}`} /></div><div className="flex flex-wrap gap-1.5"><FilterPill compact icon={<MapPin size={12} />} active={community === "all"} onClick={() => setCommunity("all")}>All locations</FilterPill>{communities.map((value) => <FilterPill compact key={value} icon={<MapPin size={12} />} active={community === value} onClick={() => setCommunity(value)}>{value}</FilterPill>)}</div></div></div>
              <div><div className="mb-2 flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate">Bedrooms</p><span className="rounded-full border border-white/80 bg-white/55 px-2.5 py-1 text-[11px] font-medium text-royal-deep shadow-[inset_0_1px_2px_rgba(255,255,255,.8)]">{minBeds}–{maxBeds >= 8 ? "8+" : maxBeds} beds</span></div><Slider className="h-10" value={[minBeds, maxBeds]} min={1} max={8} step={1} onValueChange={([min, max]) => { setMinBeds(min); setMaxBeds(max); }} aria-label="Bedrooms" /></div>
              <div><p className="mb-2 text-sm font-medium text-slate">Listing status</p><div className="flex flex-wrap gap-1.5">{Array.from(new Set(properties.map((p) => p.status))).map((value) => <FilterPill compact key={value} icon={value === "new" ? <Sparkles size={12} /> : value === "off-plan" ? <Building2 size={12} /> : <CircleDollarSign size={12} />} active={status === value} onClick={() => setStatus(value)}>{statusLabels[value]}</FilterPill>)}</div></div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={resetFilters} className="flex items-center justify-center rounded-full border border-royal-deep/20 bg-white/55 px-4 py-2.5 text-xs font-medium text-royal-deep transition hover:bg-white/80">Reset filters</button><button type="button" onClick={() => setShowMoreFilters(false)} className="flex items-center justify-center rounded-full bg-royal-deep px-4 py-2.5 text-xs font-medium text-white transition hover:bg-royal">Show results</button></div>
          </div>
        </div>
      )}
      <div className="mt-10 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-semibold text-slate sm:text-3xl">Top properties</h2></div><span className="text-sm text-slate/50">{sorted.length} results</span></div>
      {sorted.length === 0 ? <div className="py-16 text-center text-sm text-slate/50">No listings match — try a different filter.</div> : <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{sorted.map((property, index) => <PropertyCard key={property.slug} property={property} featured={index === 0} />)}</div>}
    </div>
  );
}
