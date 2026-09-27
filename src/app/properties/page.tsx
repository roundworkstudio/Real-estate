/**
 * Listings index — first rough draft. Also fixes the Nav's "Properties"
 * link, which 404'd until now.
 */
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PortfolioFilters } from "@/components/tools/PortfolioFilters";
import { InsightCalculatorsAccordion } from "@/components/tools/InsightCalculatorsAccordion";
import { sampleProperties } from "@/lib/sample-properties";

export default function PropertiesPage() {
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

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <h1 className="text-3xl font-semibold text-slate sm:text-4xl">
          Properties
        </h1>
        <p className="mt-3 max-w-lg text-slate/70">
          Filter by strategy, status, or community.
        </p>

        <div className="mt-10">
          <PortfolioFilters properties={sampleProperties} />
        </div>

        <InsightCalculatorsAccordion />
      </section>

      <Footer />
    </main>
  );
}
