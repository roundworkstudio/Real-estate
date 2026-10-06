/**
 * Valuation — first rough draft of the page SITEMAP.md already confirms
 * ("/valuation — Seller valuation request"), and the homepage's
 * ValuationPrompt CTA links to. Built 2026-09-27 during a dead-link
 * cleanup pass — previously "Request a valuation" went nowhere.
 *
 * Form UI only, not wired to send anywhere yet — same "no backend decided"
 * state as ContactSection, which this otherwise mirrors (disabled fields,
 * same reasoning).
 */
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function ValuationPage() {
  return (
    <main>
      <div className="relative hidden bg-slate md:block">
        <Nav compactStyle />
        {/* h-28, not h-20 (2026-09-27, explicit request) — the fixed
            Nav pill's own top offset + padding put its vertical centre
            ~57px down from the viewport top (see Nav.tsx's box-height
            comment), which used to leave it sitting low in this block
            with almost no margin underneath. This height centres it
            instead. */}
        <div className="h-28" />
      </div>

      <section className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
        <h1 className="text-3xl font-semibold text-slate sm:text-4xl">
          What is your property worth?
        </h1>
        <p className="mt-3 text-slate/70">
          A current valuation, priced against real comparables, not an
          automated estimate.
        </p>

        <form className="mt-10 flex flex-col gap-4">
          <input
            disabled
            placeholder="Full name"
            className="rounded-lg border border-slate/15 bg-canvas px-4 py-3 text-sm placeholder:text-slate/40"
          />
          <input
            disabled
            placeholder="Phone or email"
            className="rounded-lg border border-slate/15 bg-canvas px-4 py-3 text-sm placeholder:text-slate/40"
          />
          <input
            disabled
            placeholder="Property address"
            className="rounded-lg border border-slate/15 bg-canvas px-4 py-3 text-sm placeholder:text-slate/40"
          />
          <textarea
            disabled
            placeholder="Anything else we should know?"
            rows={4}
            className="rounded-lg border border-slate/15 bg-canvas px-4 py-3 text-sm placeholder:text-slate/40"
          />
          <Button variant="primary" className="self-start" disabled>
            Request valuation
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  );
}
