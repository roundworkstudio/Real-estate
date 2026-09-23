import { DeepPanel } from "@/components/ui/DeepPanel";
import { Button } from "@/components/ui/Button";

export function ValuationPrompt() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <DeepPanel>
        <div className="flex flex-col items-start gap-6 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">
              What is your property worth right now?
            </h2>
            <p className="mt-2 max-w-md text-white/70">
              A current valuation, priced against real comparables, not an
              automated estimate.
            </p>
          </div>
          <Button variant="light" className="shrink-0">
            Request a valuation
          </Button>
        </div>
      </DeepPanel>
    </section>
  );
}
