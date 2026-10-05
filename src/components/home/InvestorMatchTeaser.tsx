"use client";

import { useState } from "react";
import { InvestorMatchWizard } from "@/components/tools/InvestorMatchWizard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Homepage investor-matching quiz (2026-09-27, explicit request) —
 * embeds InvestorMatchWizard directly, same "surface
 * the real tool, don't just tease it" approach InvestmentToolsTeaser already
 * established for the analytics suite. Placed after that section and before
 * ValuationPrompt: tools to model a deal, then a quiz to narrow down which
 * deal, then the seller-facing valuation CTA — buyer funnel before seller
 * funnel.
 *
 * The wizard itself assumes a light page background (`text-slate` etc., no
 * wrapper of its own — unlike YieldSimulator/HoldAppreciationModel, which
 * bake in their own dark `bg-royal-deep` panel). Wrapped in a light card
 * DeepPanel for that reason, rather than recolouring the wizard itself.
 *
 * "Glassy luxury finish" (2026-09-27, explicit request) — no backdrop-blur
 * added: directives/anti-slop-ui.md scopes that to photography only, and
 * this card sits on the plain canvas page background, not a photo. The
 * "glass" here is the site's existing non-blur glass language instead —
 * GlassCard's pointer-tracked 3D tilt + sheen highlight (`pane={false}`
 * since the gradient-ring wrapper already draws the border, so GlassCard's
 * own border+inset-highlight would just double up) — plus a thin
 * sovereign-to-royal gradient ring (the "luxury" cue: this site's existing
 * gold/camel accent, not a new colour) around a soft white-to-canvas fill.
 *
 * Tilt drops out on the results screen (2026-09-27, explicit request —
 * see InvestorMatchWizard's `onResultsChange` note for why) — the
 * gradient ring and gradient fill stay either way. GlassCard remains
 * mounted so the wizard keeps its answers, while its `disabled` prop drops
 * the outer tilt once results are showing and leaves PropertyCard as the
 * only interactive card.
 */
export function InvestorMatchTeaser() {
  const [showingResults, setShowingResults] = useState(false);
  const cardClassName =
    "mobile-static-card rounded-2xl bg-gradient-to-br from-white/90 to-canvas p-6 sm:p-10";

  return (
    <section className="px-6 py-10 sm:px-10 sm:py-20">
      <Reveal>
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
          Not sure what fits? Find your match
        </h2>
        <p className="mt-2 max-w-xl text-slate/60">
          Four quick questions, matched against current inventory.
        </p>
      </Reveal>
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-gradient-to-br from-sovereign/50 via-white/40 to-royal/30 p-px shadow-card">
        <GlassCard
          pane={false}
          disabled={showingResults}
          className={cardClassName}
        >
          <InvestorMatchWizard onResultsChange={setShowingResults} />
        </GlassCard>
      </div>
    </section>
  );
}
