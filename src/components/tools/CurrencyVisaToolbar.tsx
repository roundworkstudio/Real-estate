"use client";

/**
 * Currency and Golden Visa utility toolbar for the analytics suite.
 *
 * Scope note: the brief asks for currency conversion "across all property
 * prices, rents, and cash flow readouts" — read literally, that would mean
 * retrofitting currency formatting onto every AED figure sitewide
 * (listing cards, portfolio, footer, etc.), which is a much larger and
 * separate change from the analytics suite itself. This toolbar's
 * `useCurrency()` context is scoped to the suite's own components (yield
 * simulator, hold model, payment plan) — the figures the suite computes,
 * not the whole site's existing markup.
 *
 * `top-[88px]` (not `top-0`): Nav.tsx is a fixed, always-on-top header now,
 * measured at 88px tall (py-6 plus its content) — sticking this toolbar at
 * `top-0` would tuck it directly underneath Nav instead of below it.
 */
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { useCurrency } from "@/lib/currency-context";
import { GoldenVisaBadge } from "@/components/ui/GoldenVisaBadge";

export function CurrencyVisaToolbar({ priceAed }: { priceAed: number }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="sticky top-[88px] z-20 flex flex-col gap-3 border-b border-slate/10 bg-canvas/90 px-4 py-3 backdrop-blur-none sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex flex-wrap gap-1.5">
        {CURRENCIES.map((c: { code: CurrencyCode; label: string }) => (
          <button
            key={c.code}
            type="button"
            onClick={() => setCurrency(c.code)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              currency === c.code
                ? "bg-royal text-white"
                : "bg-sand text-slate/70 hover:text-slate"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <GoldenVisaBadge priceAed={priceAed} />
    </div>
  );
}
