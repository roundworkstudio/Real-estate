"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { type CurrencyCode, convert, formatCurrency } from "./currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  format: (amountAed: number) => string;
  convert: (amountAed: number) => number;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/** Scoped to the analytics suite, not the whole site — see
 * CurrencyVisaToolbar.tsx's top comment for why. */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("AED");

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      format: (amountAed: number) => formatCurrency(amountAed, currency),
      convert: (amountAed: number) => convert(amountAed, currency),
    }),
    [currency],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
