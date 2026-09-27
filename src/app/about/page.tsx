/**
 * About — merges what were two separate pages (2026-09-27, explicit
 * request): bio/credentials (SITEMAP.md's "/about") and the area-guide
 * index (SITEMAP.md's "/areas"). Both are "about her practice" in the
 * reader's sense — who she is, where she works — so folding areas in here
 * as a second section removes a nav item without losing either. /areas
 * now redirects here (see next.config.ts's `redirects()`; #areas is the
 * tab below). The property-detail page's neighbourhood-notes placeholder
 * still refers to "the matching /areas guide" in prose — that wording is
 * about per-area guide content that doesn't exist yet, not this URL
 * specifically, so it was left as-is.
 *
 * The two sections live under MorphingTabs now (2026-09-27, "clean and
 * tidies up pages" — see that component's own note), not stacked with a
 * `#areas` scroll-jump. The effect below reads `location.hash` once on
 * mount so the redirected `/areas` → `/about#areas` link still opens on
 * the areas tab rather than the bio one.
 *
 * Bio, headshot, and credentials are all pending from the client
 * (docs/client-inputs-required.md); the "9 years active" figure reuses
 * CredibilityNumbers' own placeholder rather than inventing a second,
 * inconsistent one. Avatar is a plain initial, not a fabricated photo —
 * same choice AboutPreview made. The area list is the same illustrative
 * one the old homepage AreasServed section used before it was replaced by
 * InvestmentToolsTeaser — real UAE place names as generic filler, not a
 * coverage claim; "how many communities she covers" is still an open
 * client input that decides whether this is three cards or fifteen.
 */
"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PLACEHOLDER_TEL_URL } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { MorphingTabs } from "@/components/ui/MorphingTabs";

const areas = [
  "Saadiyat Island",
  "Yas Island",
  "Al Reem Island",
  "Al Raha Beach",
  "Ramhan Island",
  "Downtown Dubai",
  "Dubai Marina",
  "Palm Jumeirah",
];

export default function AboutPage() {
  const [tab, setTab] = useState<"about" | "areas">("about");

  useEffect(() => {
    // Syncing from an external system (the URL the browser navigated to,
    // e.g. the old /areas → /about#areas redirect), not derivable from
    // props/state — the documented exception to this lint rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.location.hash.slice(1) === "areas") setTab("areas");
  }, []);

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

      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-sand text-3xl font-semibold text-slate">
            J
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate sm:text-4xl">
              About
            </h1>
            <p className="mt-4 text-slate/70">
              Placeholder bio copy, standing in for the real one. Covers
              years active, specialism, and what makes her approach
              different, in her own words rather than generated copy, once
              the real bio is supplied — see docs/client-inputs-required.md.
            </p>
          </div>
        </div>

        <MorphingTabs
          className="mt-12"
          ariaLabel="About sections"
          value={tab}
          onValueChange={(id) => setTab(id as "about" | "areas")}
          items={[
            {
              id: "about",
              label: "Credentials",
              content: (
                <div className="p-6 sm:p-10">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <div className="text-2xl font-semibold text-slate">9</div>
                      <div className="mt-1 text-sm text-slate/60">Years active</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-slate">
                        [pending]
                      </div>
                      <div className="mt-1 text-sm text-slate/60">
                        Specialism — placeholder
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-slate">
                        [pending]
                      </div>
                      <div className="mt-1 text-sm text-slate/60">
                        Languages — placeholder
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <Button href={PLACEHOLDER_TEL_URL} variant="primary">
                      Book a call
                    </Button>
                  </div>
                </div>
              ),
            },
            {
              id: "areas",
              label: "Areas we cover",
              content: (
                <div id="areas" className="scroll-mt-24 p-6 sm:p-10">
                  <p className="max-w-lg text-sm text-slate/60">
                    Illustrative list — actual coverage and per-area guide
                    content pending, see docs/client-inputs-required.md.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {areas.map((a) => (
                      <div
                        key={a}
                        className="rounded-2xl border border-slate/10 bg-white/40 p-6"
                      >
                        <div className="font-medium text-slate">{a}</div>
                        <div className="mt-1 text-sm text-slate/50">
                          Guide content pending
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </section>

      <Footer />
    </main>
  );
}
