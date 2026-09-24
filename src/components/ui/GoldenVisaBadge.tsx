import { goldenVisaStatus } from "@/lib/currency";

/**
 * Real, dynamic state per directives/anti-slop-ui.md's badge rule — this
 * changes with the price it's given, never decoration. No emoji: the
 * directive bans them in the interface, so eligibility is carried by
 * colour and text alone.
 */
export function GoldenVisaBadge({ priceAed }: { priceAed: number }) {
  const { eligible, shortfallAed } = goldenVisaStatus(priceAed);

  if (eligible) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-sovereign/10 px-3.5 py-1.5 text-sm font-medium text-sovereign">
        <span className="h-2 w-2 rounded-full bg-sovereign" />
        Eligible for the 10-year Golden Visa
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col gap-1.5 rounded-2xl bg-sand px-3.5 py-2 text-sm">
      <span className="font-medium text-slate">
        AED {Math.round(shortfallAed).toLocaleString("en-AE")} short of the Golden
        Visa threshold
      </span>
      <span className="h-1.5 w-40 overflow-hidden rounded-full bg-slate/10">
        <span
          className="block h-full rounded-full bg-royal"
          style={{
            width: `${Math.min(100, ((priceAed) / 2_000_000) * 100)}%`,
          }}
        />
      </span>
    </div>
  );
}
