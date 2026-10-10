"use client";

/**
 * Sticky currency switcher for calculator suites. Golden Visa readout
 * removed at client request (scheme is too uncertain to surface).
 */
import { CurrencySwitcher } from "@/components/tools/CurrencySwitcher";

export function CurrencyVisaToolbar() {
  return <CurrencySwitcher sticky />;
}
