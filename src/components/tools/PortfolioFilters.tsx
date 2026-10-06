"use client";

import { useMemo, useState } from "react";
import { Building2, ChevronDown, CircleDollarSign, House, MapPin, Search, SlidersHorizontal, Sparkles, TrendingUp, X } from "lucide-react";
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

function IntentTile({ active, title, description, icon, onClick }: { active: boolean; title: string; description: string; icon: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`flex h-16 w-64 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border p-2 text-center shadow-[inset_0_1px_2px_rgba(255,255,255,.8)] backdrop-blur-md transition sm:h-28 sm:w-full sm:flex-row sm:justify-start sm:gap-3 sm:px-4 sm:text-left ${active ? "border-royal-deep/30 bg-royal-deep text-white shadow-sm" : "border-white/80 bg-white/55 text-slate hover:bg-white/80"}`}>
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-white/15 text-white" : "bg-white/75 text-royal-deep"}`}>{icon}</span>
    <span className="min-w-0"><span className="block text-xs font-semibold leading-tight sm:text-sm">{title}</span><span className={`hidden text-[11px] leading-tight sm:block ${active ? "text-white/70" : "text-slate/55"}`}>{description}</span></span>
  </button>;
}

export function PortfolioFilters({ properties }: { properties: Property[] }) {
  const [strategy, setStrategy] = useState<PropertyStrategy | "all">("all");
  const [status, setStatus] = useState<PropertyStatus | "all">("all");
  const [community, setCommunity] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showFilterContent, setShowFilterContent] = useState(true);
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
          <button type="button" aria-label="Show more filters" aria-expanded={showMoreFilters} onClick={() => { setShowMoreFilters(true); setShowFilterContent(true); }} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/85 text-slate shadow-[inset_0_1px_2px_rgba(255,255,255,.85),0_5px_18px_rgba(58,45,40,.06)] backdrop-blur-md transition hover:bg-white/80 sm:hidden ${showMoreFilters ? "bg-royal-deep text-white" : "bg-white/60"}`}><SlidersHorizontal size={18} /></button>
        </div>
      <div className={`${showMoreFilters ? "flex" : "hidden"} fixed inset-0 z-50 items-end justify-center bg-slate/20 p-3 pb-0 backdrop-blur-sm sm:static sm:inset-auto sm:z-auto sm:mt-4 sm:flex sm:items-stretch sm:justify-start sm:bg-transparent sm:p-0 sm:backdrop-blur-none`} role="presentation" onClick={() => setShowMoreFilters(false)}>
          <div role="dialog" aria-modal="true" aria-label="More filters" onClick={(event) => event.stopPropagation()} className="filter-sheet-mobile max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-[2rem] rounded-b-none border border-white/85 bg-white/75 p-4 shadow-[0_24px_80px_-30px_rgba(46,36,32,.45)] backdrop-blur-2xl sm:max-h-none sm:max-w-none sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
            <div className="flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-royal">Refine your search</p><button type="button" aria-expanded={showFilterContent} aria-controls="filter-content" onClick={() => setShowFilterContent((open) => !open)} className="mt-1 hidden items-center gap-2 text-left text-2xl font-semibold text-slate sm:inline-flex"><span>More filters</span><ChevronDown size={19} className={`transition-transform ${showFilterContent ? "rotate-180" : ""}`} /></button><h3 className="mt-1 text-2xl font-semibold text-slate sm:hidden">More filters</h3></div><button type="button" aria-label="Close filters" onClick={() => setShowMoreFilters(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-slate transition hover:bg-white sm:hidden"><X size={18} /></button></div>
            <div id="filter-content" className={`grid grid-rows-[1fr] translate-y-0 overflow-hidden opacity-100 transition-[grid-template-rows,opacity,transform] duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${showFilterContent ? "sm:grid-rows-[1fr] sm:translate-y-0 sm:opacity-100" : "sm:pointer-events-none sm:grid-rows-[0fr] sm:-translate-y-2 sm:opacity-0"}`}>
              <div className="min-h-0 overflow-hidden">
              <div className="mt-5 space-y-4 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-3 sm:space-y-0">
              <div className="sm:row-span-4 sm:flex sm:h-full sm:flex-col"><p className="mb-2 text-sm font-medium text-slate">I’m looking to</p><div className="flex flex-col gap-2 sm:mt-auto"><IntentTile icon={<Building2 size={17} />} active={visitorIntent === "all"} onClick={() => setVisitorIntent("all")} title="All listings" description="Browse every available home, from move-in properties to new opportunities." /><IntentTile icon={<House size={17} />} active={visitorIntent === "buyer"} onClick={() => setVisitorIntent("buyer")} title="Buy a home" description="Focus on homes suited to living, relocation, and day-to-day use." /><IntentTile icon={<TrendingUp size={17} />} active={visitorIntent === "investor"} onClick={() => setVisitorIntent("investor")} title="Invest" description="Explore listings with investment context, income potential, or a growth strategy." /></div></div>
              <label className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/85 bg-white/55 px-3.5 py-2 text-xs font-medium text-slate shadow-[inset_0_1px_2px_rgba(255,255,255,.9),0_8px_20px_rgba(58,45,40,.06)] backdrop-blur-md sm:col-start-2 sm:mt-7 sm:rounded-full sm:bg-white/65"><span>Order listings</span><span className="relative flex items-center rounded-full border border-white/75 bg-white/45 shadow-[inset_0_1px_2px_rgba(255,255,255,.8)]"><select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="appearance-none bg-transparent py-1 pl-3 pr-7 text-right text-xs font-medium text-royal-deep outline-none"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="beds-high">Most bedrooms</option></select><ChevronDown size={13} className="pointer-events-none absolute right-2 text-royal-deep/70" /></span></label>
              <div className="sm:col-start-2"><p className="mb-2 text-sm font-medium text-slate">Strategy</p><div className="flex flex-wrap gap-1.5"><FilterPill compact icon={<House size={12} />} active={strategy === "all"} onClick={() => setStrategy("all")}>All strategies</FilterPill>{Array.from(new Set(properties.map((p) => p.strategy))).map((value) => <FilterPill compact key={value} icon={value === "yield" ? <TrendingUp size={12} /> : <Building2 size={12} />} active={strategy === value} onClick={() => setStrategy(value)}>{strategyLabels[value]}</FilterPill>)}</div></div>
              <div className="sm:col-start-2 sm:row-start-3"><p className="mb-2 text-sm font-medium text-slate">Location</p><div className="flex flex-wrap gap-1.5"><FilterPill compact icon={<MapPin size={12} />} active={community === "all"} onClick={() => setCommunity("all")}>All locations</FilterPill>{communities.map((value) => <FilterPill compact key={value} icon={<MapPin size={12} />} active={community === value} onClick={() => setCommunity(value)}>{value}</FilterPill>)}</div></div>
              <div className="sm:col-start-2 sm:row-start-4"><p className="mb-2 text-sm font-medium text-slate">Listing status</p><div className="flex flex-wrap gap-1.5">{Array.from(new Set(properties.map((p) => p.status))).map((value) => <FilterPill compact key={value} icon={value === "new" ? <Sparkles size={12} /> : value === "off-plan" ? <Building2 size={12} /> : <CircleDollarSign size={12} />} active={status === value} onClick={() => setStatus(value)}>{statusLabels[value]}</FilterPill>)}</div></div>
              <div className="sm:col-span-2 sm:row-start-5"><p className="mb-2 text-sm font-medium text-slate">Price</p><div className="space-y-2"><FluidSlider className="h-10 w-full" min={500_000} max={15_000_000} step={100_000} value={minPriceAed} onValueChange={(value) => setMinPriceAed(Math.min(value, maxPriceAed))} aria-label="Minimum price" format={(value) => `Min AED ${(value / 1_000_000).toFixed(1)}m`} /><FluidSlider className="h-10 w-full" min={500_000} max={15_000_000} step={100_000} value={maxPriceAed} onValueChange={(value) => setMaxPriceAed(Math.max(value, minPriceAed))} aria-label="Maximum price" format={(value) => `Max AED ${value >= 15_000_000 ? "15.0m+" : `${(value / 1_000_000).toFixed(1)}m`}`} /></div></div>
              <div className="sm:col-span-2 sm:row-start-6"><div className="mb-2 flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate">Bedrooms</p><span className="rounded-full border border-white/80 bg-white/55 px-2.5 py-1 text-[11px] font-medium text-royal-deep shadow-[inset_0_1px_2px_rgba(255,255,255,.8)]">{minBeds}–{maxBeds >= 8 ? "8+" : maxBeds} beds</span></div><Slider className="h-10 w-full" value={[minBeds, maxBeds]} min={1} max={8} step={1} onValueChange={([min, max]) => { setMinBeds(min); setMaxBeds(max); }} aria-label="Bedrooms" /></div>
              </div>
              <div className="mt-5"><button type="button" onClick={resetFilters} className="flex w-full items-center justify-center rounded-full border border-royal-deep/20 bg-white/55 px-4 py-2.5 text-xs font-medium text-royal-deep transition hover:bg-white/80">Reset filters</button><button type="button" onClick={() => setShowMoreFilters(false)} className="mt-2 flex w-full items-center justify-center rounded-full bg-royal-deep px-4 py-2.5 text-xs font-medium text-white transition hover:bg-royal sm:hidden">Show results</button></div>
              </div>
            </div>
          </div>
      </div>
      </div>
      <div className="mt-10 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-semibold text-slate sm:text-3xl">Top properties</h2></div><span className="text-sm text-slate/50">{sorted.length} results</span></div>
      {sorted.length === 0 ? <div className="py-16 text-center text-sm text-slate/50">No listings match — try a different filter.</div> : <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{sorted.map((property, index) => <PropertyCard key={property.slug} property={property} featured={index === 0} />)}</div>}
    </div>
  );
}
