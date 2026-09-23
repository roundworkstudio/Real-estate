"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
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

const steps = ["Budget", "Target yield", "Strategy", "Risk"] as const;

function StepShell({
  title,
  children,
  step,
  onBack,
  onNext,
  nextLabel = "Next",
}: {
  title: string;
  children: React.ReactNode;
  step: number;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div>
      <div className="text-xs font-medium text-slate/50">
        Step {step + 1} of {steps.length}
      </div>
      <h3 className="mt-2 text-xl font-semibold text-slate">{title}</h3>
      <div className="mt-6">{children}</div>
      <div className="mt-8 flex gap-3">
        {onBack && (
          <Button variant="dark" onClick={onBack}>
            Back
          </Button>
        )}
        <Button variant="primary" onClick={onNext}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

/**
 * Real intake flow (budget → target yield → strategy → risk tolerance),
 * filtering against the same sample-properties data used on the homepage.
 * With two sample listings, "matching" is illustrative by definition —
 * this demonstrates the mechanism honestly rather than dressing it up as
 * a real portfolio search. Real matching needs real inventory, which is
 * an open client input (docs/client-inputs-required.md).
 */
export function InvestorMatchWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(defaults);
  const [done, setDone] = useState(false);

  if (done) {
    const matches = sampleProperties.filter(
      (p) => p.priceAed <= answers.budgetAed * 1.15,
    );

    return (
      <div>
        <div className="text-xs font-medium text-slate/50">
          Sample match — illustrative only, see component note
        </div>
        <h3 className="mt-2 text-xl font-semibold text-slate">
          {matches.length > 0
            ? `${matches.length} listing${matches.length > 1 ? "s" : ""} match your criteria`
            : "No current listings match — Janvi will reach out directly"}
        </h3>
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          {matches.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
        <Button
          variant="dark"
          className="mt-8"
          onClick={() => {
            setStep(0);
            setAnswers(defaults);
            setDone(false);
          }}
        >
          Start over
        </Button>
      </div>
    );
  }

  if (step === 0) {
    return (
      <StepShell title="What's your budget?" step={step} onNext={() => setStep(1)}>
        <input
          type="range"
          min={500_000}
          max={15_000_000}
          step={100_000}
          value={answers.budgetAed}
          onChange={(e) =>
            setAnswers((a) => ({ ...a, budgetAed: Number(e.target.value) }))
          }
          className="h-1.5 w-full max-w-md cursor-pointer appearance-none rounded-full bg-slate/10 accent-royal"
        />
        <div className="mt-2 text-2xl font-semibold tabular-nums text-slate">
          AED {answers.budgetAed.toLocaleString("en-AE")}
        </div>
      </StepShell>
    );
  }

  if (step === 1) {
    return (
      <StepShell
        title="What yield are you targeting?"
        step={step}
        onBack={() => setStep(0)}
        onNext={() => setStep(2)}
      >
        <input
          type="range"
          min={2}
          max={12}
          step={0.5}
          value={answers.targetYieldPercent}
          onChange={(e) =>
            setAnswers((a) => ({
              ...a,
              targetYieldPercent: Number(e.target.value),
            }))
          }
          className="h-1.5 w-full max-w-md cursor-pointer appearance-none rounded-full bg-slate/10 accent-royal"
        />
        <div className="mt-2 text-2xl font-semibold tabular-nums text-slate">
          {answers.targetYieldPercent.toFixed(1)}%
        </div>
      </StepShell>
    );
  }

  if (step === 2) {
    return (
      <StepShell
        title="Turnkey, or open to a rehab project?"
        step={step}
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
      >
        <div className="flex gap-3">
          {(["turnkey", "value-add"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setAnswers((a) => ({ ...a, strategy: opt }))}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                answers.strategy === opt
                  ? "bg-royal text-white"
                  : "bg-slate/5 text-slate hover:bg-slate/10"
              }`}
            >
              {opt === "turnkey" ? "Turnkey" : "Value-add / rehab"}
            </button>
          ))}
        </div>
      </StepShell>
    );
  }

  return (
    <StepShell
      title="Risk tolerance?"
      step={step}
      onBack={() => setStep(2)}
      onNext={() => setDone(true)}
      nextLabel="See matches"
    >
      <div className="flex flex-wrap gap-3">
        {(["conservative", "moderate", "aggressive"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setAnswers((a) => ({ ...a, riskTolerance: opt }))}
            className={`rounded-full px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
              answers.riskTolerance === opt
                ? "bg-royal text-white"
                : "bg-slate/5 text-slate hover:bg-slate/10"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </StepShell>
  );
}
