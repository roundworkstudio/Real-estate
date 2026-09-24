/**
 * 5-year hold & capital appreciation model. Deliberately simplified and
 * labelled as such in the UI: it treats the down payment as the invested
 * capital and the net rental income as an unlevered cash flow (it does not
 * net out mortgage debt service against appreciation gains the way a fully
 * leveraged waterfall would). For a debt-serviced monthly cash flow, see
 * the Investment analysis calculator (lib/mortgage.ts) elsewhere on the
 * page — this model answers a different question (five-year equity growth
 * under a scenario), not the same one in more detail.
 */
export type HoldScenario = "conservative" | "base" | "bull";

export const SCENARIO_GROWTH_PERCENT: Record<HoldScenario, number> = {
  conservative: 2.5,
  base: 5.0,
  bull: 8.5,
};

export const SCENARIO_LABELS: Record<HoldScenario, string> = {
  conservative: "Conservative",
  base: "Base case",
  bull: "Bull case",
};

export type HoldAppreciationInputs = {
  purchasePriceAed: number;
  downPaymentPercent: number;
  annualGrowthPercent: number;
  holdYears: number;
  /** Net rental income for the year, assumed flat across the hold period. */
  annualNetCashFlowAed: number;
};

export type YearPoint = {
  year: number;
  appreciationAed: number; // asset value gained since year 0
  cumulativeCashFlowAed: number;
};

export type HoldAppreciationResults = {
  initialEquityAed: number;
  projectedExitValueAed: number;
  cumulativeRentalIncomeAed: number;
  totalEquityCreatedAed: number;
  netIRRPercent: number | null;
  equityMultiple: number;
  series: YearPoint[];
};

/** Bisection IRR solver — the cash flow series here is well-behaved (one
 * sign change: an outflow followed by inflows), so bisection is simpler
 * and just as reliable as Newton's method for this case. */
function solveIrr(cashFlows: number[]): number | null {
  const npv = (rate: number) =>
    cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);

  let low = -0.99;
  let high = 5; // 500% — comfortably above any bull-case scenario here
  const lowVal = npv(low);
  const highVal = npv(high);
  if (lowVal === 0) return low;
  if (highVal === 0) return high;
  if (lowVal * highVal > 0) return null; // no sign change in range

  let mid = 0;
  for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    const midVal = npv(mid);
    if (Math.abs(midVal) < 1e-6) break;
    if (midVal > 0 === lowVal > 0) low = mid;
    else high = mid;
  }
  return mid;
}

export function calculateHoldAppreciation(
  inputs: HoldAppreciationInputs,
): HoldAppreciationResults {
  const { purchasePriceAed, downPaymentPercent, annualGrowthPercent, holdYears, annualNetCashFlowAed } =
    inputs;

  const initialEquityAed = purchasePriceAed * (downPaymentPercent / 100);
  const growthRate = annualGrowthPercent / 100;

  const series: YearPoint[] = [];
  let cumulativeCashFlow = 0;
  for (let year = 0; year <= holdYears; year++) {
    if (year > 0) cumulativeCashFlow += annualNetCashFlowAed;
    const assetValueAed = purchasePriceAed * Math.pow(1 + growthRate, year);
    series.push({
      year,
      appreciationAed: assetValueAed - purchasePriceAed,
      cumulativeCashFlowAed: cumulativeCashFlow,
    });
  }

  const projectedExitValueAed = purchasePriceAed * Math.pow(1 + growthRate, holdYears);
  const cumulativeRentalIncomeAed = annualNetCashFlowAed * holdYears;
  const appreciationAed = projectedExitValueAed - purchasePriceAed;
  const totalEquityCreatedAed = appreciationAed + cumulativeRentalIncomeAed;

  const equityMultiple =
    initialEquityAed > 0 ? (initialEquityAed + totalEquityCreatedAed) / initialEquityAed : 0;

  // Exit-year proceeds assume the original loan balance is repaid in full
  // from the sale (no amortisation paydown modelled) — a conservative
  // simplification, since paydown over the hold would only add to equity.
  const cashFlows: number[] = [-initialEquityAed];
  for (let year = 1; year < holdYears; year++) cashFlows.push(annualNetCashFlowAed);
  cashFlows.push(annualNetCashFlowAed + projectedExitValueAed - (purchasePriceAed - initialEquityAed));

  const irr = solveIrr(cashFlows);

  return {
    initialEquityAed,
    projectedExitValueAed,
    cumulativeRentalIncomeAed,
    totalEquityCreatedAed,
    netIRRPercent: irr === null ? null : irr * 100,
    equityMultiple,
    series,
  };
}
