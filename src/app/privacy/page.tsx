/**
 * Privacy — first rough draft of the page SITEMAP.md already confirms
 * ("/privacy — Privacy policy (required)") and flags under its compliance
 * notes ("Privacy policy and cookie consent"). Built 2026-09-27 during a
 * dead-link cleanup pass — previously the footer's "Privacy" link went
 * nowhere. No policy text is invented here — a fabricated privacy policy
 * is worse than a missing one, same reasoning as the footer's bracketed
 * BRN/ORN — this needs real legal review before it says anything binding.
 */
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <main>
      <div className="relative bg-slate">
        <Nav />
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
          Privacy policy
        </h1>
        <p className="mt-4 text-slate/70">
          [pending] — this page needs real legal review before it ships. No
          policy text is published here yet.
        </p>
      </section>

      <Footer />
    </main>
  );
}
