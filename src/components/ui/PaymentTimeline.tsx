import { PLAN_TIMELINES, type PaymentStructureId } from "@/lib/paymentPlan";
import { FormattedPrice } from "@/components/ui/FormattedPrice";

/**
 * "Start with" entry figure plus a single bar showing who pays each slice
 * of the price and when. Every number comes from the published schedule
 * in lib/paymentPlan.ts; renders nothing for plans without a timeline.
 */
export function PaymentTimeline({
  structureId,
  fromPriceAed,
  tone = "light",
  className = "",
}: {
  structureId?: PaymentStructureId;
  fromPriceAed: number;
  tone?: "light" | "dark";
  className?: string;
}) {
  const plan = structureId ? PLAN_TIMELINES[structureId] : undefined;
  if (!plan) return null;

  const deposit = plan.segments[0];
  const yourShare = plan.segments.filter((s) => s.payer === "you").reduce((a, s) => a + s.percent, 0);
  const dark = tone === "dark";
  const muted = dark ? "text-white/75" : "text-slate/70";

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <p className={`text-xs ${muted}`}>Start with</p>
        <p className={`text-xs ${muted}`}>{deposit.percent}% {deposit.when.toLowerCase()}</p>
      </div>
      <p className={`text-2xl font-semibold leading-tight ${dark ? "text-white" : "text-slate"}`}>
        <FormattedPrice amountAed={fromPriceAed * (deposit.percent / 100)} />
      </p>

      <div
        className="mt-3 flex h-2.5 gap-0.5 overflow-hidden rounded-full"
        role="img"
        aria-label={`You pay ${yourShare}% in stages, ${plan.financedBy} finances ${100 - yourShare}%`}
      >
        {plan.segments.map((s, i) => (
          <span
            key={i}
            style={{ width: `${s.percent}%` }}
            title={`${s.percent}% · ${s.when} · ${s.payer === "you" ? "You" : plan.financedBy}`}
            className={
              s.payer === "you"
                ? dark ? "bg-white" : "bg-royal-deep"
                : dark ? "bg-white/30" : "bg-sand"
            }
          />
        ))}
      </div>

      <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs ${muted}`}>
        <span className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${dark ? "bg-white" : "bg-royal-deep"}`} />
          You {yourShare}%, over {plan.youPayOver}
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${dark ? "bg-white/30" : "bg-sand"}`} />
          {plan.financedBy} finances {100 - yourShare}%
        </span>
      </div>
    </div>
  );
}
