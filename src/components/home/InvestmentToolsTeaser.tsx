import { TrendingUp, LineChart, Landmark } from "lucide-react";
import { InsightToolCard } from "@/components/ui/InsightToolCard";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Replaces AreasServed (2026-09-27, explicit request) in this homepage
 * slot. Unlike that section, nothing here is fabricated filler — same
 * `tools` list and InsightToolCard already used on the analytics suite's
 * own section, just linking out to its anchors instead of scrolling in
 * place. Surfaces the tool suite (previously only reachable via nav or a
 * development detail page) directly on the homepage, which fits this
 * site's whole positioning better than a list of place-name chips did —
 * see Hero.tsx's "presented like an investment" line.
 *
 * Hrefs point at /insights, not /analytics — that page merged into
 * Insights as a second section 2026-09-27 (see app/insights/page.tsx);
 * /analytics still resolves via next.config.ts's `redirects()`, but
 * pointing directly at the real destination skips the extra hop.
 */
const tools = [
  {
    icon: TrendingUp,
    title: "Yield strategy simulator",
    description: "Short-term let vs. long-term lease, side by side.",
    href: "/insights#yield-strategy",
  },
  {
    icon: LineChart,
    title: "5-year hold & appreciation",
    description: "Project equity growth under a market scenario.",
    href: "/insights#hold-appreciation",
  },
  {
    icon: Landmark,
    title: "Payment plan & fees",
    description: "Capital outlay by milestone, every fee at closing.",
    href: "/insights#payment-plan",
  },
];

export function InvestmentToolsTeaser() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <Reveal>
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
          Model the numbers before you call
        </h2>
        <p className="mt-2 max-w-xl text-slate/60">
          The same yield, hold-period, and payment-plan tools our advisors
          use, open to run against current inventory.
        </p>
      </Reveal>
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
    </section>
  );
}
