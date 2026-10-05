import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PortfolioFilters } from "@/components/tools/PortfolioFilters";
import { sampleProperties } from "@/lib/sample-properties";

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="relative hidden bg-slate md:block"><Nav /><div className="h-28" /></div>
      <section className="relative overflow-hidden bg-gradient-to-b from-mist/75 via-canvas to-canvas pt-28 md:pt-10">
        <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-sovereign/20 blur-3xl" />
        <div className="mx-auto max-w-6xl px-5 pb-14 sm:px-10 sm:pb-20">
          <div className="max-w-3xl"><p className="text-sm font-medium text-royal">Property with Janvi</p><h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-slate sm:text-5xl lg:text-6xl">Explore modern living spaces <span className="font-accent">near you.</span></h1><p className="mt-5 max-w-xl text-base leading-relaxed text-slate/65 sm:text-lg">A considered collection of homes, villas and investment opportunities across Abu Dhabi and Dubai.</p></div>
          <div className="mt-10"><PortfolioFilters properties={sampleProperties} /></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
