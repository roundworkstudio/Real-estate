/**
 * Investor-matching intake. Not yet in SITEMAP.md's confirmed page list —
 * added because it was explicitly requested, but flagging it here so it
 * gets folded into the sitemap discussion rather than silently becoming a
 * permanent fixture nobody decided on.
 */
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { InvestorMatchWizard } from "@/components/tools/InvestorMatchWizard";

export default function InvestPage() {
  return (
    <main>
      <div className="relative bg-slate">
        <Nav />
        <div className="h-20" />
      </div>

      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <h1 className="text-3xl font-semibold text-slate sm:text-4xl">
          Find your match
        </h1>
        <p className="mt-3 max-w-lg text-slate/70">
          Four questions, matched against current inventory.
        </p>

        <div className="mt-10">
          <InvestorMatchWizard />
        </div>
      </section>

      <Footer />
    </main>
  );
}
