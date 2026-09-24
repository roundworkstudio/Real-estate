/**
 * Dual-strategy rental yield model — short-term (holiday-home) rental vs.
 * a standard long-term Ejari lease. Every output is a live computation
 * from the inputs on screen, same honesty rule as lib/mortgage.ts. DEWA
 * (utilities) is included because STR listings pay it themselves; a
 * long-term tenant typically pays their own, so it defaults to 0 there.
 */
export type RentalStrategy = "str" | "long-term";

export type YieldStrategyInputs = {
  priceAed: number;
  sqft: number;
  strategy: RentalStrategy;
  nightlyRateAed: number;
  monthlyRentAed: number;
  occupancyPercent: number; // 0-100
  serviceChargePerSqftAed: number;
  managementFeePercent: number; // 0-100
  dewaMonthlyAed: number;
};

export type YieldStrategyResults = {
  grossAnnualIncomeAed: number;
  serviceChargeAnnualAed: number;
  managementFeeAnnualAed: number;
  dewaAnnualAed: number;
  totalOperatingExpensesAed: number;
  netAnnualIncomeAed: number;
  grossYieldPercent: number;
  netYieldPercent: number;
  monthlyCashFlowAed: number;
};

export function calculateYieldStrategy(inputs: YieldStrategyInputs): YieldStrategyResults {
  const {
    priceAed,
    sqft,
    strategy,
    nightlyRateAed,
    monthlyRentAed,
    occupancyPercent,
    serviceChargePerSqftAed,
    managementFeePercent,
    dewaMonthlyAed,
  } = inputs;

  const grossAnnualIncomeAed =
    strategy === "str"
      ? nightlyRateAed * 365 * (occupancyPercent / 100)
      : monthlyRentAed * 12 * (occupancyPercent / 100);

  const serviceChargeAnnualAed = serviceChargePerSqftAed * sqft;
  const managementFeeAnnualAed = grossAnnualIncomeAed * (managementFeePercent / 100);
  const dewaAnnualAed = dewaMonthlyAed * 12;
  const totalOperatingExpensesAed = serviceChargeAnnualAed + managementFeeAnnualAed + dewaAnnualAed;
  const netAnnualIncomeAed = grossAnnualIncomeAed - totalOperatingExpensesAed;

  return {
    grossAnnualIncomeAed,
    serviceChargeAnnualAed,
    managementFeeAnnualAed,
    dewaAnnualAed,
    totalOperatingExpensesAed,
    netAnnualIncomeAed,
    grossYieldPercent: priceAed > 0 ? (grossAnnualIncomeAed / priceAed) * 100 : 0,
    netYieldPercent: priceAed > 0 ? (netAnnualIncomeAed / priceAed) * 100 : 0,
    monthlyCashFlowAed: netAnnualIncomeAed / 12,
  };
}

/** Defaults per strategy, per the brief: occupancy and management fee
 * assumptions differ meaningfully between a managed holiday let and a
 * standard annual lease. */
export const STRATEGY_DEFAULTS: Record<
  RentalStrategy,
  { occupancyPercent: number; managementFeePercent: number; dewaMonthlyAed: number }
> = {
  str: { occupancyPercent: 78, managementFeePercent: 18, dewaMonthlyAed: 650 },
  "long-term": { occupancyPercent: 95, managementFeePercent: 5, dewaMonthlyAed: 0 },
};
