/**
 * Deal-economics math for the investment calculator. Deliberately simple
 * and transparent — see docs/property-page-spec.md's "Investment analysis"
 * section, which this implements the "deal economics" group of (price per
 * sqft, yield). No IRR: that needs a hold period and an appreciation/exit
 * assumption neither the brief nor the client has supplied yet — adding it
 * would mean inventing those assumptions, not calculating from real ones.
 *
 * Every number here is a live computation from the inputs on screen, not a
 * fabricated figure — the honesty rule that applies to sample listing data
 * applies here too, just enforced by the formula instead of a code comment.
 */

export type CalculatorInputs = {
  priceAed: number;
  downPaymentPercent: number; // 0-100
  interestRatePercent: number; // annual, 0-100
  vacancyRatePercent: number; // 0-100
  monthlyRentAed: number;
  /** UAE mortgage terms are commonly quoted around 25 years; fixed here
   * rather than exposed as a slider, since varying it alongside three
   * other sliders makes the numbers harder to read for no real benefit
   * in a first pass. */
  termYears?: number;
};

export type CalculatorResults = {
  downPaymentAed: number;
  loanAmountAed: number;
  monthlyMortgagePaymentAed: number;
  effectiveGrossIncomeAed: number; // annual, after vacancy
  netOperatingIncomeAed: number; // annual — see note below
  capRatePercent: number;
  annualCashFlowAed: number;
  monthlyCashFlowAed: number;
  cashOnCashReturnPercent: number;
};

/** Standard amortizing monthly payment. */
function monthlyPayment(loanAmount: number, annualRatePercent: number, termYears: number): number {
  const r = annualRatePercent / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return loanAmount / n;
  return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const {
    priceAed,
    downPaymentPercent,
    interestRatePercent,
    vacancyRatePercent,
    monthlyRentAed,
    termYears = 25,
  } = inputs;

  const downPaymentAed = priceAed * (downPaymentPercent / 100);
  const loanAmountAed = priceAed - downPaymentAed;
  const monthlyMortgagePaymentAed = monthlyPayment(loanAmountAed, interestRatePercent, termYears);

  const effectiveGrossIncomeAed =
    monthlyRentAed * 12 * (1 - vacancyRatePercent / 100);

  // No service-charge/opex figure is entered here (that's per-listing,
  // agent-supplied data per docs/property-page-spec.md, not yet modelled
  // for sample properties) — NOI equals effective gross income until that
  // exists. Flagged in the UI as an assumption, not hidden.
  const netOperatingIncomeAed = effectiveGrossIncomeAed;

  const capRatePercent = (netOperatingIncomeAed / priceAed) * 100;

  const annualDebtServiceAed = monthlyMortgagePaymentAed * 12;
  const annualCashFlowAed = netOperatingIncomeAed - annualDebtServiceAed;
  const monthlyCashFlowAed = annualCashFlowAed / 12;
  const cashOnCashReturnPercent =
    downPaymentAed > 0 ? (annualCashFlowAed / downPaymentAed) * 100 : 0;

  return {
    downPaymentAed,
    loanAmountAed,
    monthlyMortgagePaymentAed,
    effectiveGrossIncomeAed,
    netOperatingIncomeAed,
    capRatePercent,
    annualCashFlowAed,
    monthlyCashFlowAed,
    cashOnCashReturnPercent,
  };
}
