"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, KeyRound, Landmark, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * UI shell for a natural-language "ask AI" search bar. The input and
 * quick-filter pills are genuinely interactive (typing works, pills fill
 * the input) — what's NOT wired is the AI/search part itself: parsing a
 * query like this and matching it against real inventory needs an LLM
 * integration and real listings, neither of which exist. Same reason the
 * plain search bar it replaced was a visual placeholder — see
 * docs/client-inputs-required.md (the listings-system question) — this
 * doesn't resolve that, it just makes the placeholder more honest about
 * what the eventual feature is.
 *
 * No emoji — directives/anti-slop-ui.md bans them in UI; Lucide icons
 * carry the same intent (sparkles for "AI", and an icon per quick filter)
 * without the tell.
 */
const quickFilters = [
  {
    icon: TrendingUp,
    label: "High cash-flow STR",
    query: "High cash-flow short-term rentals",
  },
  {
    icon: KeyRound,
    label: "Off-market under AED 3M",
    query: "Off-market listings under AED 3M",
  },
  {
    icon: Landmark,
    label: "Value-add projects",
    query: "Value-add renovation projects",
  },
];

export function AISearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative px-6 sm:px-10">
      <div className="rounded-2xl bg-white/95 p-4 shadow-card backdrop-blur-sm sm:p-5">
        <div className="flex items-center gap-3">
          <Sparkles size={20} className="shrink-0 text-royal" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI: &lsquo;Find off-market deals in Palm Jumeirah with 8%+ net yield under AED 5M&rsquo;…"
            className="w-full bg-transparent text-sm text-slate placeholder:text-slate/50 focus:outline-none sm:text-base"
          />
          <button
            disabled
            title="Not wired yet — needs an LLM integration and real inventory to search over"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-sand/30 text-slate/70 hover:bg-sand/40 border border-sand/50 px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 px-0">
        {quickFilters.map(({ icon: Icon, label, query: q }) => (
          <button
            key={label}
            onClick={() => setQuery(q)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-3.5 py-1.5 text-sm text-white transition-all hover:bg-white/20 hover:border-white/30"
          >
            <Icon size={14} className="text-white/70" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
