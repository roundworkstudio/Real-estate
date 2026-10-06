import type { Viewport } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { HeroShimmerHeading } from "@/components/home/HeroShimmerHeading";
import { PortfolioFilters } from "@/components/tools/PortfolioFilters";
import { sampleProperties } from "@/lib/sample-properties";

export const viewport: Viewport = {
  themeColor: "#f1ede6",
  colorScheme: "light",
};

export default function PropertiesPage() {
  return (
    <main data-page="properties" className="min-h-screen bg-canvas">
      <div className="relative hidden bg-slate md:block"><Nav compactStyle /><div className="h-20" /></div>
      <section className="relative overflow-hidden bg-canvas pt-28 md:pt-10">
        <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-sovereign/20 blur-3xl" />
        <div className="mx-auto max-w-6xl px-5 pb-14 sm:px-10 sm:pb-20">
          <div className="max-w-3xl"><HeroShimmerHeading light={false} className="leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Explore modern living spaces <span className="font-accent">in the UAE.</span></HeroShimmerHeading></div>
          <div className="mt-10"><PortfolioFilters properties={sampleProperties} /></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
