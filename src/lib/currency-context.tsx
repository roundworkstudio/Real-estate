"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  type CurrencyCode,
  convert,
  formatCompactPrice,
  formatCurrency,
} from "./currency";

const STORAGE_KEY = "janvi-display-currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  format: (amountAed: number) => string;
  formatCompact: (amountAed: number) => string;
  convert: (amountAed: number) => number;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function isCurrencyCode(value: string | null): value is CurrencyCode {
  return (
    value === "AED" ||
    value === "USD" ||
    value === "EUR" ||
    value === "GBP" ||
    value === "INR" ||
    value === "USDT" ||
    value === "BTC"
  );
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("AED");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    // Restoring from localStorage after hydration: an external system,
    // not derivable during render without a mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isCurrencyCode(saved)) setCurrencyState(saved);
  }, []);

  const setCurrency = (next: CurrencyCode) => {
    setCurrencyState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      format: (amountAed: number) => formatCurrency(amountAed, currency),
      formatCompact: (amountAed: number) =>
        formatCompactPrice(amountAed, currency),
      convert: (amountAed: number) => convert(amountAed, currency),
    }),
    [currency],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
