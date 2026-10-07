"use client";

import type { ReactNode } from "react";
import { CurrencyProvider } from "@/lib/currency-context";
import { CompareProvider } from "@/lib/compare-context";
import { CompareBar } from "@/components/tools/CompareBar";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <CompareProvider>
        {children}
        <CompareBar />
      </CompareProvider>
    </CurrencyProvider>
  );
}
