"use client";

import { useCallback, useEffect, useState } from "react";
import { TrendingUp, LineChart, Landmark } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
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
    imageSrc: "/media/insights/yield-strategy.jpg",
    imageAlt:
      "Luxury Dubai apartment styled for short-term and long-term living",
  },
  {
    icon: LineChart,
    title: "5-year hold & appreciation",
    description: "Project equity growth under a market scenario.",
    href: "/insights#hold-appreciation",
    imageSrc: "/media/insights/hold-appreciation.jpg",
    imageAlt:
      "Architectural model showing a residential development growing over time",
  },
  {
    icon: Landmark,
    title: "Payment plan & fees",
    description: "Capital outlay by milestone, every fee at closing.",
    href: "/insights#payment-plan",
    imageSrc: "/media/insights/payment-plan.jpg",
    imageAlt:
      "Architectural plan, calculator, and property key on a luxury advisor desk",
  },
];

export function InvestmentToolsTeaser() {
  const prefersReducedMotion = useReducedMotion();
  const [autoplay] = useState(() => Autoplay({ delay: 2000 }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true },
    [autoplay],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateSelectedIndex = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", updateSelectedIndex);
    emblaApi.on("reInit", updateSelectedIndex);

    return () => {
      emblaApi.off("select", updateSelectedIndex);
      emblaApi.off("reInit", updateSelectedIndex);
    };
  }, [emblaApi, updateSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    if (prefersReducedMotion) autoplay.stop();
    else autoplay.play();
  }, [autoplay, emblaApi, prefersReducedMotion]);

  return (
    <section className="px-6 py-10 sm:px-10 sm:py-20">
      <Reveal>
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
          Model the numbers before you call
        </h2>
        <p className="mt-2 max-w-xl text-slate/60">
          The same yield, hold-period, and payment-plan tools our advisors
          use, open to run against current inventory.
        </p>
      </Reveal>
      <div className="mt-10 sm:hidden">
        <div
          ref={emblaRef}
          className="overflow-hidden touch-pan-y"
          aria-roledescription="carousel"
          aria-label="Investment tools"
        >
          <div className="-ml-4 flex">
            {tools.map((tool) => (
              <div
                key={tool.title}
                className="min-w-0 flex-[0_0_88%] pl-4"
                aria-roledescription="slide"
              >
                <InsightToolCard
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  href={tool.href}
                  imageSrc={tool.imageSrc}
                  imageAlt={tool.imageAlt}
                  areaGuideStyle
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-5 flex items-center justify-center gap-2"
          aria-hidden
        >
          {tools.map((tool, index) => (
            <span
              key={tool.title}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                index === selectedIndex ? "w-6 bg-royal-deep" : "w-1.5 bg-sand"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-slate/45">
          Swipe to explore
        </p>
      </div>

      <div className="mt-10 hidden gap-4 sm:grid sm:grid-cols-3">
        {tools.map((t, i) => (
          <Reveal key={t.title} delayMs={i * 60} className="h-full">
            <InsightToolCard
              icon={t.icon}
              title={t.title}
              description={t.description}
              href={t.href}
              imageSrc={t.imageSrc}
              imageAlt={t.imageAlt}
              areaGuideStyle
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
