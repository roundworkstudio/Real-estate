"use client";

/**
 * Insights: the Abu Dhabi villa market in sourced numbers, what they mean
 * for a buyer, what buying costs, how off-plan works, then the calculators.
 * Every figure lives in lib/insights.ts with its source; fee totals come
 * from lib/paymentPlan.ts. /analytics redirects here, and the homepage's
 * InvestmentToolsTeaser links to #yield-strategy, #hold-appreciation and
 * #payment-plan, which open the matching calculator tab.
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { sampleProperties } from "@/lib/sample-properties";
import { developmentForProperty } from "@/lib/developments";
import { INSIGHTS_AS_OF, MARKET_BOARD, OFF_PLAN_STEPS, SOURCES, TAKEAWAYS } from "@/lib/insights";
import { KineticTextReveal } from "@/components/ui/kinetic-text-reveal";
import { AnnotatedText } from "@/components/ui/annotated-text";
import { Reveal } from "@/components/ui/Reveal";
import { FlapBoard } from "@/components/insights/FlapBoard";
import { BuyingCosts } from "@/components/insights/BuyingCosts";
import { StackedSteps } from "@/components/insights/StackedSteps";
import { JumpDock } from "@/components/insights/JumpDock";
import { DevelopmentAnalytics, type ToolId } from "@/components/tools/DevelopmentAnalytics";

const HERO_IMAGE = {
  src: "/media/area-guides/saadiyat-island.jpg",
  alt: "The Louvre Abu Dhabi's lattice dome over still water on Saadiyat Island",
};

const JUMP_LINKS = [
  { href: "#market", label: "Market" },
  { href: "#takeaways", label: "What it means" },
  { href: "#costs", label: "Buying costs" },
  { href: "#off-plan", label: "Off-plan" },
  { href: "#tools", label: "Calculators" },
];

const HASH_TO_TOOL: Record<string, ToolId> = {
  tools: "plan",
  "payment-plan": "plan",
  "yield-strategy": "yield",
  "hold-appreciation": "growth",
};

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-royal">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-slate sm:text-3xl">{title}</h2>
      {intro && <p className="mt-3 leading-relaxed text-slate/70">{intro}</p>}
    </div>
  );
}

export default function InsightsPage() {
  const [slug, setSlug] = useState(sampleProperties[0].slug);
  const [tool, setTool] = useState<ToolId>("plan");
  const property = sampleProperties.find((p) => p.slug === slug) ?? sampleProperties[0];
  const meta = developmentForProperty(property)?.meta;

  useEffect(() => {
    const openFromHash = () => {
      const fromHash = HASH_TO_TOOL[window.location.hash.slice(1)];
      if (!fromHash) return;
      setTool(fromHash);
      requestAnimationFrame(() => {
        document.getElementById("tools")?.scrollIntoView({ block: "start" });
      });
    };
    const timeout = window.setTimeout(openFromHash);
    window.addEventListener("hashchange", openFromHash);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("hashchange", openFromHash);
    };
  }, []);

  return (
    <main>
      <section className="relative flex min-h-[700px] flex-col justify-end overflow-hidden pt-32 sm:h-[78vh] sm:min-h-[600px] sm:pt-0">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          preload
          quality={90}
          sizes="100vw"
          className="object-cover object-[50%_62%] max-md:origin-[50%_85%] max-md:scale-[1.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/50 via-55% to-slate/20" />
        <Nav compactStyle />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-5 sm:px-10 sm:pb-10">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem] md:items-end">
            <div className="px-2 sm:px-0">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">Market insights</p>
              <h1 className="mt-3 max-w-3xl text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.025em] text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.25)] sm:text-7xl">
                <KineticTextReveal
                  text="The Abu Dhabi villa market, in numbers"
                  stagger={0.06}
                  delay={0.1}
                  className="inline whitespace-normal"
                />
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/80 sm:text-base">
                Where prices and rents stand, what it costs to buy, and how off-plan runs from booking to keys.
              </p>
            </div>

            <div className="liquid-glass hidden rounded-[1.75rem] p-5 text-white md:block">
              <div className="flex items-center justify-between text-xs text-white/75">
                <span className="font-medium uppercase tracking-[0.14em]">Villa values</span>
                <span>Q2 2026</span>
              </div>
              <p className="mt-3 flex items-start text-6xl font-semibold tracking-[-0.04em]">
                +12<span className="mt-1.5 text-3xl">%</span>
              </p>
              <p className="mt-1 text-sm text-white/80">Year on year, Abu Dhabi</p>
              <p className="mt-4 border-t border-white/15 pt-3 text-[11px] text-white/60">Source: ValuStrat</p>
            </div>
          </div>

          <JumpDock
            links={JUMP_LINKS}
            status={
              <>
                <p className="hidden shrink-0 items-center gap-2 py-2 pl-4 pr-5 text-xs font-medium text-white/85 sm:flex">
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inset-0 animate-ping rounded-full bg-sovereign/70 motion-reduce:animate-none" />
                    <span className="relative h-2 w-2 rounded-full bg-sovereign" />
                  </span>
                  Updated {INSIGHTS_AS_OF}
                </p>
                <span aria-hidden className="hidden h-6 w-px shrink-0 bg-white/20 sm:block" />
              </>
            }
          />
          <p className="mt-3 flex items-center justify-center gap-2 text-[11px] text-white/70 sm:hidden">
            <span className="h-1.5 w-1.5 rounded-full bg-sovereign" aria-hidden />
            Updated {INSIGHTS_AS_OF}
          </p>
        </div>
      </section>

      <section id="market" className="mx-auto mt-12 max-w-5xl scroll-mt-24 px-6 sm:mt-16 sm:px-10" aria-label="Market figures">
        <Reveal>
          <FlapBoard rows={MARKET_BOARD} />
        </Reveal>
      </section>

      <section id="takeaways" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28">
        <SectionHeading eyebrow="What it means" title="Three things to know before you buy" />
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {TAKEAWAYS.map((t, i) => (
            <Reveal key={t.emphasis} delayMs={i * 100}>
              <h3 className="text-lg font-semibold leading-snug text-slate">
                {t.title}{" "}
                <AnnotatedText variant="underline" color="text-sovereign" delay={0.2 + i * 0.15}>
                  {t.emphasis}
                </AnnotatedText>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate/70">{t.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="costs" className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-20 sm:px-10 sm:pb-28">
        <SectionHeading
          eyebrow="Costs"
          title="What it costs to buy"
          intro="Abu Dhabi charges half Dubai’s registration fee and no trustee fee, so the same villa costs noticeably less to buy."
        />
        <Reveal className="mt-8">
          <BuyingCosts />
        </Reveal>
      </section>

      <section id="off-plan" className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-20 sm:px-10 sm:pb-28">
        <SectionHeading
          eyebrow="Off-plan"
          title="How buying off-plan works"
          intro="Five steps from booking to keys, using Wadeem Gardens’ published plan as the example."
        />
        <div className="mt-10">
          <StackedSteps steps={OFF_PLAN_STEPS} />
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-20 sm:px-10 sm:pb-28">
        <span id="payment-plan" className="block scroll-mt-24" aria-hidden />
        <span id="yield-strategy" className="block scroll-mt-24" aria-hidden />
        <span id="hold-appreciation" className="block scroll-mt-24" aria-hidden />
        <SectionHeading
          eyebrow="Calculators"
          title="Run the numbers on a home"
          intro="Payment plan, rental yield and five-year growth for any listed home, using the same figures as its project page."
        />
        <label className="relative mt-8 block max-w-sm">
          <span className="sr-only">Home</span>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full appearance-none truncate rounded-full bg-slate/[0.05] py-3 pl-5 pr-11 text-sm font-medium text-slate shadow-[inset_0_1px_2px_rgb(46_36_32/0.08)]"
          >
            {sampleProperties.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.community} · {p.beds} bed
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
        </label>
        <div className="mt-6">
          <DevelopmentAnalytics
            key={tool}
            properties={[property]}
            defaultTool={tool}
            defaultPaymentStructureId={meta?.paymentStructureId ?? "60-40"}
            paymentStructureIds={meta?.paymentStructureId ? [meta.paymentStructureId] : undefined}
            handoverMonths={meta?.handoverMonths}
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
        <div className="border-t border-slate/10 pt-8">
          <h2 className="text-sm font-semibold text-slate">Sources</h2>
          <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate/55">
            {SOURCES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-5 max-w-3xl text-xs leading-relaxed text-slate/55">
            Market figures are as of {INSIGHTS_AS_OF} and change quarter to quarter. They&apos;re guides, not
            advice or guarantees. For a view on a specific home,{" "}
            <Link href="/contact" className="text-royal underline-offset-4 hover:underline">
              talk to Janvi
            </Link>
            .
          </p>
          <p className="mt-3 text-xs text-slate/40">Photo: Louvre Abu Dhabi by Nazar Skalatsky, Unsplash.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
