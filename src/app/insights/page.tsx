"use client";

/**
 * Insights — merges what were two separate pages (2026-09-27, explicit
 * request): the market-notes index SITEMAP.md calls "/insights", and the
 * interactive Analytics & Insight Suite that used to live at its own
 * /analytics route (added outside SITEMAP.md, see that page's old top
 * comment). Both are "insight" in the reader's sense — one editorial, one
 * a calculator — so folding the tool suite in here as a second section
 * removes a nav item without losing either. /analytics now redirects here
 * (see next.config.ts's `redirects()`; #tools is the tools section below,
 * #yield-strategy/#hold-appreciation/#payment-plan still work as deep
 * links into it — InvestmentToolsTeaser.tsx points at those directly).
 *
 * The two sections live under MorphingTabs now (2026-09-27, "clean and
 * tidies up pages" — see that component's own note), not stacked with a
 * `#tools` scroll-jump — a long, un-scannable single-column dump was
 * exactly what merging the two old pages risked. The hash-based deep
 * links from InvestmentToolsTeaser still work: the effect below reads
 * `location.hash` once on mount, switches to the tools tab if it matches,
 * then scrolls the specific sub-anchor into view once that panel mounts.
 *
 * "Who writes area guide and insights copy?" is still an open question in
 * SITEMAP.md's decisions table. The market-notes tab used to be three
 * "Market note — placeholder / Coming soon" stub cards; replaced
 * 2026-09-27 ("add market/insights/etc. using this style", pointing at
 * beui.dev's prediction-market-card) with MarketCard — real counts and
 * averages derived from sampleProperties (buildMarketSnapshotCards), not
 * editorial copy, so this doesn't get ahead of that open question by
 * inventing headlines. Once real market-note content exists it likely
 * wants its own tab alongside these, not a replacement for them — these
 * cards are legitimate "current sample inventory" snapshots on their own.
 */
import { useEffect, useMemo, useState } from "react";
import { TrendingUp, LineChart, Landmark, LayoutGrid } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { sampleProperties } from "@/lib/sample-properties";
import { buildMarketSnapshotCards } from "@/lib/market-snapshot";
import { CurrencyProvider } from "@/lib/currency-context";
import { CurrencyVisaToolbar } from "@/components/tools/CurrencyVisaToolbar";
import { YieldSimulator } from "@/components/tools/YieldSimulator";
import { HoldAppreciationModel } from "@/components/tools/HoldAppreciationModel";
import { PaymentPlanCalculator } from "@/components/tools/PaymentPlanCalculator";
import { InsightToolCard } from "@/components/ui/InsightToolCard";
import { MarketCard } from "@/components/ui/MarketCard";
import { Reveal } from "@/components/ui/Reveal";
import { ImageBreak } from "@/components/ui/ImageBreak";
import { MorphingTabs } from "@/components/ui/MorphingTabs";
import { GOLDEN_VISA_THRESHOLD_AED } from "@/lib/currency";

const TOOLS_SUB_ANCHORS = ["tools", "yield-strategy", "hold-appreciation", "payment-plan"];

const tools = [
  {
    icon: TrendingUp,
    title: "Yield strategy simulator",
    description: "Short-term let vs. long-term lease, side by side.",
    href: "#yield-strategy",
  },
  {
    icon: LineChart,
    title: "5-year hold & appreciation",
    description: "Project equity growth under a market scenario.",
    href: "#hold-appreciation",
  },
  {
    icon: Landmark,
    title: "Payment plan & fees",
    description: "Capital outlay by milestone, every fee at closing.",
    href: "#payment-plan",
  },
];

export default function InsightsPage() {
  const [slug, setSlug] = useState(sampleProperties[0].slug);
  const property = sampleProperties.find((p) => p.slug === slug) ?? sampleProperties[0];
  const estimatedAnnualNetCashFlow = Math.round(
    (property.expectedAnnualRentAed ?? property.priceAed * 0.05) * 0.85,
  );
  const gallery = property.gallery ?? [property.image];
  const breakImage = (i: number) => gallery[i % gallery.length];

  const marketSnapshotCards = useMemo(
    () => buildMarketSnapshotCards(sampleProperties),
    [],
  );

  const [tab, setTab] = useState<"notes" | "tools">("notes");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!TOOLS_SUB_ANCHORS.includes(hash)) return;
    // Syncing from an external system (the URL the browser navigated to,
    // e.g. InvestmentToolsTeaser's /insights#yield-strategy links), not
    // derivable from props/state — the documented exception to this rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTab("tools");
    if (hash === "tools") return;
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
    });
  }, []);

  return (
    <main>
      <div className="relative hidden bg-slate md:block">
        <Nav />
        {/* h-28, not h-20 (2026-09-27, explicit request) — the fixed
            Nav pill's own top offset + padding put its vertical centre
            ~57px down from the viewport top (see Nav.tsx's box-height
            comment), which used to leave it sitting low in this block
            with almost no margin underneath. This height centres it
            instead. */}
        <div className="h-28" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <h1 className="text-3xl font-semibold text-slate sm:text-4xl">
          Insights
        </h1>
        <p className="mt-3 max-w-lg text-slate/70">
          Market notes and analysis, plus the tools to model a deal against
          current inventory.
        </p>

        <MorphingTabs
          className="mt-12"
          ariaLabel="Insights sections"
          value={tab}
          onValueChange={(id) => setTab(id as "notes" | "tools")}
          items={[
            {
              id: "notes",
              label: "Market notes",
              content: (
                <div className="p-6 sm:p-10">
                  <p className="max-w-lg text-sm text-slate/60">
                    A snapshot of the current sample inventory — not live
                    market data, see docs/client-inputs-required.md.
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {marketSnapshotCards.map((card, i) => (
                      <Reveal key={card.id} delayMs={i * 100}>
                        <MarketCard
                          icon={LayoutGrid}
                          category={card.category}
                          title={card.title}
                          status={card.status}
                          volume={card.volume}
                          outcomes={card.outcomes}
                        />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              id: "tools",
              label: "Analytics & insight suite",
              content: (
                <div id="tools" className="scroll-mt-24 p-6 sm:p-10">
                  <p className="max-w-xl text-sm text-slate/60">
                    Model a deal against current inventory: yield strategy,
                    five-year hold, payment plan and closing fees, all in one
                    place.
                  </p>

                  <label className="mt-8 block max-w-sm">
                    <span className="text-sm text-slate/60">Property</span>
                    <select
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="mt-2 w-full truncate rounded-xl border border-slate/15 bg-white/60 px-4 py-2.5 text-sm text-slate"
                    >
                      {sampleProperties.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.title} · AED {p.priceAed.toLocaleString("en-AE")}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {tools.map((t, i) => (
                      <Reveal key={t.title} delayMs={i * 100}>
                        <InsightToolCard
                          icon={t.icon}
                          title={t.title}
                          description={t.description}
                          href={t.href}
                        />
                      </Reveal>
                    ))}
                  </div>

                  <CurrencyProvider>
                    <div className="mt-10 -mx-6 sm:-mx-10">
                      <CurrencyVisaToolbar priceAed={property.priceAed} />
                    </div>

                    <div className="mt-10 space-y-16">
                      <div id="yield-strategy" className="scroll-mt-24">
                        <h3 className="text-lg font-semibold text-slate">
                          Yield strategy simulator
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm text-slate/60">
                          Compare a short-term holiday let against a standard
                          long-term lease.
                        </p>
                        <div className="mt-6">
                          <YieldSimulator priceAed={property.priceAed} sqft={property.sqft} />
                        </div>
                      </div>

                      <ImageBreak
                        src={breakImage(2).src}
                        alt={breakImage(2).alt}
                        eyebrow="Golden Visa"
                        value={`AED ${GOLDEN_VISA_THRESHOLD_AED.toLocaleString("en-AE")}`}
                        label="Purchase price threshold for the 10-year UAE Golden Visa"
                      />

                      <div id="hold-appreciation" className="scroll-mt-24">
                        <h3 className="text-lg font-semibold text-slate">
                          5-year hold &amp; appreciation model
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm text-slate/60">
                          Project equity growth over a hold period under a
                          market scenario.
                        </p>
                        <div className="mt-6">
                          <HoldAppreciationModel
                            purchasePriceAed={property.priceAed}
                            annualNetCashFlowAed={estimatedAnnualNetCashFlow}
                          />
                        </div>
                      </div>

                      <ImageBreak
                        src={breakImage(4).src}
                        alt={breakImage(4).alt}
                        eyebrow={`${property.community}, ${property.city}`}
                        value={`${property.sqft.toLocaleString("en-AE")} sqft`}
                        label={property.title}
                      />

                      <div id="payment-plan" className="scroll-mt-24">
                        <h3 className="text-lg font-semibold text-slate">
                          Payment plan &amp; fee transparency
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm text-slate/60">
                          Capital outlay by milestone and every upfront fee
                          due at closing.
                        </p>
                        <div className="mt-6">
                          <PaymentPlanCalculator
                            priceAed={property.priceAed}
                            city={property.city}
                            defaultStructureId={
                              property.community === "Wadeem Gardens" ? "wadeem-adib" : "60-40"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CurrencyProvider>
                </div>
              ),
            },
          ]}
        />
      </section>

      <Footer />
    </main>
  );
}
