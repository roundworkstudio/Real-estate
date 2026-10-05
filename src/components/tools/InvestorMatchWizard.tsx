"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { FluidSlider } from "@/components/motion/range-slider-fluid";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { sampleProperties } from "@/lib/sample-properties";

type Answers = {
  budgetAed: number;
  targetYieldPercent: number;
  strategy: "turnkey" | "value-add";
  riskTolerance: "conservative" | "moderate" | "aggressive";
};

const defaults: Answers = {
  budgetAed: 3_000_000,
  targetYieldPercent: 5,
  strategy: "turnkey",
  riskTolerance: "moderate",
};

const TOTAL_STEPS = 4;

/**
 * Progress bar + choice-card layout is shadcn's "Questionnaire" component
 * pattern (2026-09-27, explicit request — "keep font and theme but use
 * this style"), rebuilt on this project's own primitives rather than
 * installed from shadcn: the segmented bar, one-question-per-step shell,
 * and selectable choice cards are the borrowed shape, restyled in the
 * warm-mono palette (`royal`/`slate`/`canvas`) and Poppins/`.font-accent`
 * instead of shadcn's neutral defaults. No external dependency added.
 */
function ProgressBar({ step }: { step: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={step + 1}
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      className="flex items-center gap-1.5"
    >
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            i <= step ? "bg-royal" : "bg-slate/10"
          }`}
        />
      ))}
    </div>
  );
}

function QuestionShell({
  title,
  description,
  children,
  step,
  onBack,
  onNext,
  nextLabel = "Next",
}: {
  title: string;
  description: string;
  children: ReactNode;
  step: number;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div>
      <ProgressBar step={step} />
      <div className="mt-5 text-xs font-medium tracking-wide text-slate/40 uppercase">
        Question {step + 1} of {TOTAL_STEPS}
      </div>
      <h3 className="mt-2 text-xl font-semibold text-slate sm:text-2xl">
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate/60">{description}</p>
      <div className="mt-8">{children}</div>
      <div className="mt-10 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-slate/50 transition-colors hover:text-slate"
          >
            Previous
          </button>
        ) : (
          <span />
        )}
        <Button variant="primary" onClick={onNext}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

function ChoiceCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-xl border p-4 text-left transition-colors ${
        selected
          ? "border-royal bg-royal/5"
          : "border-slate/15 hover:border-royal/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-slate">{label}</span>
        <span
          className={`h-4 w-4 shrink-0 rounded-full border transition-colors ${
            selected ? "border-royal bg-royal" : "border-slate/25"
          }`}
        />
      </div>
      {description && (
        <p className="mt-1 text-sm text-slate/60">{description}</p>
      )}
    </button>
  );
}

/**
 * Real intake flow (budget → target yield → strategy → risk tolerance),
 * filtering against the same sample-properties data used on the homepage.
 * With two sample listings, "matching" is illustrative by definition —
 * this demonstrates the mechanism honestly rather than dressing it up as
 * a real portfolio search. Real matching needs real inventory, which is
 * an open client input (docs/client-inputs-required.md).
 *
 * `onResultsChange` (optional) tells a caller when the results screen is
 * showing — InvestorMatchTeaser uses it to drop its outer GlassCard tilt
 * while PropertyCard's own hover/tilt is active on the matches grid
 * (2026-09-27, explicit request — "remove the hover effect on the match
 * your criteria section"): two nested pointer-tracked tilt elements, one
 * reacting to the mouse position across the whole big card and one per
 * listing inside it, fought each other and read as broken, not luxurious.
 */
export function InvestorMatchWizard({
  onResultsChange,
}: {
  onResultsChange?: (showingResults: boolean) => void;
} = {}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(defaults);
  const [done, setDone] = useState(false);

  if (done) {
    const matches = sampleProperties.filter(
      (p) => p.priceAed <= answers.budgetAed * 1.15,
    );

    return (
      <div>
        <ProgressBar step={TOTAL_STEPS - 1} />
        <div className="mt-5 text-xs font-medium tracking-wide text-slate/40 uppercase">
          Sample match — illustrative only, see component note
        </div>
        <h3 className="mt-2 text-xl font-semibold text-slate sm:text-2xl">
          {matches.length > 0
            ? `${matches.length} listing${matches.length > 1 ? "s" : ""} match your criteria`
            : "No current listings match — Janvi will reach out directly"}
        </h3>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-x-8 sm:gap-y-12">
          {matches.map((p) => (
            <PropertyCard
              key={p.slug}
              property={p}
              compactOnMobile
              minimal
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setAnswers(defaults);
            setDone(false);
            onResultsChange?.(false);
          }}
          className="mt-8 text-sm font-medium text-slate/50 transition-colors hover:text-slate"
        >
          Start over
        </button>
      </div>
    );
  }

  if (step === 0) {
    return (
      <QuestionShell
        title="What's your budget?"
        description="Drag to set the ceiling — this sets the range we'll match against."
        step={step}
        onNext={() => setStep(1)}
      >
        <FluidSlider
          label="Budget"
          min={500_000}
          max={15_000_000}
          step={100_000}
          value={answers.budgetAed}
          onValueChange={(budgetAed) =>
            setAnswers((a) => ({ ...a, budgetAed }))
          }
          aria-label="Maximum budget"
          format={(value) => `AED ${value.toLocaleString("en-AE")}`}
        />
      </QuestionShell>
    );
  }

  if (step === 1) {
    return (
      <QuestionShell
        title="What yield are you targeting?"
        description="Net rental yield, before financing costs."
        step={step}
        onBack={() => setStep(0)}
        onNext={() => setStep(2)}
      >
        <FluidSlider
          label="Target yield"
          min={2}
          max={12}
          step={0.5}
          value={answers.targetYieldPercent}
          onValueChange={(targetYieldPercent) =>
            setAnswers((a) => ({ ...a, targetYieldPercent }))
          }
          aria-label="Target net rental yield"
          format={(value) => `${value.toFixed(1)}%`}
        />
      </QuestionShell>
    );
  }

  if (step === 2) {
    return (
      <QuestionShell
        title="Turnkey, or open to a rehab project?"
        description="Value-add deals need more hands-on involvement in exchange for a lower entry price."
        step={step}
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ChoiceCard
            label="Turnkey"
            description="Move-in or rent-ready on completion."
            selected={answers.strategy === "turnkey"}
            onClick={() => setAnswers((a) => ({ ...a, strategy: "turnkey" }))}
          />
          <ChoiceCard
            label="Value-add / rehab"
            description="Lower entry price, upside from repositioning."
            selected={answers.strategy === "value-add"}
            onClick={() =>
              setAnswers((a) => ({ ...a, strategy: "value-add" }))
            }
          />
        </div>
      </QuestionShell>
    );
  }

  return (
    <QuestionShell
      title="Risk tolerance?"
      description="How much volatility in price and timeline are you comfortable with?"
      step={step}
      onBack={() => setStep(2)}
      onNext={() => {
        setDone(true);
        onResultsChange?.(true);
      }}
      nextLabel="See matches"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(
          [
            {
              value: "conservative",
              description: "Stable, established areas.",
            },
            { value: "moderate", description: "Balanced growth and stability." },
            {
              value: "aggressive",
              description: "Emerging areas, higher upside.",
            },
          ] as const
        ).map((opt) => (
          <ChoiceCard
            key={opt.value}
            label={opt.value[0].toUpperCase() + opt.value.slice(1)}
            description={opt.description}
            selected={answers.riskTolerance === opt.value}
            onClick={() =>
              setAnswers((a) => ({ ...a, riskTolerance: opt.value }))
            }
          />
        ))}
      </div>
    </QuestionShell>
  );
}
