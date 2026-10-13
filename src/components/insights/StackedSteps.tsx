"use client";

/**
 * Steps that pin and stack as you scroll, after Componentry's sticky scroll
 * cards: each card sticks a little lower than the last and the ones beneath
 * shrink back, so the whole sequence stays visible as a pile.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { BuyingStep } from "@/lib/insights";

function StepCard({
  step,
  index,
  total,
  progress,
}: {
  step: BuyingStep;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.035]);

  return (
    <li className="sticky" style={{ top: `calc(6.5rem + ${index * 0.9}rem)` }}>
      <motion.article
        style={reduce ? undefined : { scale }}
        className="origin-top rounded-[1.75rem] border border-slate/10 bg-canvas p-6 shadow-[0_24px_50px_-28px_rgb(46_36_32/0.45)] sm:p-9"
      >
        <div className="sm:flex sm:items-baseline sm:gap-6">
          <span className="block font-accent text-2xl text-royal sm:text-4xl">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="mt-2 text-lg font-semibold text-slate sm:mt-0 sm:text-xl">{step.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate/70 sm:text-base">{step.body}</p>
          </div>
        </div>
      </motion.article>
    </li>
  );
}

export function StackedSteps({ steps, className = "space-y-[14vh]" }: { steps: BuyingStep[]; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <ol ref={ref} className={`pb-[6vh] ${className}`}>
      {steps.map((step, i) => (
        <StepCard key={step.title} step={step} index={i} total={steps.length} progress={scrollYProgress} />
      ))}
    </ol>
  );
}
