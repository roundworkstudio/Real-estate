import type { Viewport } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { HeroShimmerHeading } from "@/components/home/HeroShimmerHeading";
import { WalkInBackdrop } from "@/components/ui/WalkInBackdrop";
import { SunlightSweep } from "@/components/ui/SunlightSweep";
import { PortfolioFilters } from "@/components/tools/PortfolioFilters";
import { InvestorMatchTeaser } from "@/components/home/InvestorMatchTeaser";
import { sampleProperties } from "@/lib/sample-properties";

export const viewport: Viewport = {
  themeColor: "#f1ede6",
  colorScheme: "light",
};

export default function PropertiesPage() {
  return (
    <main data-page="properties" className="min-h-screen bg-canvas">
      <Nav compactStyle />
      <section className="relative overflow-hidden bg-canvas pt-28 md:pt-28">
        <WalkInBackdrop
          src="/media/hero/properties-sandstone-facade-v2.jpg"
          className="absolute inset-x-0 top-0 h-[38rem] opacity-50 [mask-composite:intersect] [mask-image:linear-gradient(to_bottom_left,black_0%,black_25%,rgb(0_0_0/0.5)_65%,rgb(0_0_0/0.25)_100%),linear-gradient(to_bottom,black_55%,transparent_100%)] sm:h-[44rem] sm:opacity-70"
        />
        <SunlightSweep className="absolute inset-x-0 top-0 h-[38rem] sm:h-[44rem]" />
        <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-sovereign/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 sm:px-10 sm:pb-20">
          <div className="max-w-3xl">
            <HeroShimmerHeading light={false} className="leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Explore modern living spaces <span className="font-accent">in the UAE.</span>
            </HeroShimmerHeading>
            <p className="mt-4 inline-block max-w-xl rounded-xl bg-canvas/70 px-3 py-2 text-sm text-slate/75 backdrop-blur-sm">
              Sample inventory for layout — status, prices, and specs are
              placeholders until live listings replace them.
            </p>
          </div>
          <div className="mt-10">
            <PortfolioFilters properties={sampleProperties} />
          </div>
        </div>
      </section>
      <InvestorMatchTeaser />
      <Footer />
    </main>
  );
}
