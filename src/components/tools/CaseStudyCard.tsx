import { BeforeAfterSlider } from "./BeforeAfterSlider";

export type CaseStudy = {
  title: string;
  location: string;
  entryPriceAed: number;
  entryDate: string; // e.g. "2021"
  capitalOutlayAed: number;
  yieldDuringHoldPercent: number;
  exitPriceAed: number;
  exitDate: string;
  equityMultiple: number; // e.g. 1.85
  netIrrPercent: number;
  /** Thesis, execution, exit — three sentences, no more. */
  narrative: [string, string, string];
  beforeSrc: string;
  afterSrc: string;
  isSample?: boolean;
};

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-slate/10 py-3 text-sm last:border-0">
      <span className="text-slate/60">{label}</span>
      <span className="font-medium tabular-nums text-slate">{value}</span>
    </div>
  );
}

/**
 * Realized-return case study. Real, closed-deal numbers only — see
 * component note on CaseStudyCard's `isSample`. Presenting invented
 * acquisition/exit figures and an IRR as though they were a genuine,
 * audited result is a materially different thing from the sample-listing
 * placeholders used elsewhere on this site, so this is labelled far more
 * insistently, not just a code comment.
 */
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div>
      {study.isSample && (
        <div className="mb-4 inline-flex items-center rounded-full bg-slate/5 px-3 py-1 text-xs font-medium text-slate/60">
          Sample case study — not a real result
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BeforeAfterSlider
            beforeSrc={study.beforeSrc}
            afterSrc={study.afterSrc}
            beforeLabel="Acquisition"
            afterLabel="Exit"
            capex={[]}
            isSample={false}
          />

          <h3 className="mt-6 text-xl font-semibold text-slate">
            {study.title}
          </h3>
          <div className="text-sm text-slate/60">{study.location}</div>

          <div className="mt-4 space-y-3 text-sm text-slate/70">
            {study.narrative.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <Metric
            label="Acquisition"
            value={`AED ${study.entryPriceAed.toLocaleString("en-AE")} (${study.entryDate})`}
          />
          <Metric
            label="Capital outlay"
            value={`AED ${study.capitalOutlayAed.toLocaleString("en-AE")}`}
          />
          <Metric
            label="Yield during hold"
            value={`${study.yieldDuringHoldPercent.toFixed(1)}%`}
          />
          <Metric
            label="Exit"
            value={`AED ${study.exitPriceAed.toLocaleString("en-AE")} (${study.exitDate})`}
          />
          <Metric
            label="Equity multiple"
            value={`${study.equityMultiple.toFixed(2)}x`}
          />
          <Metric label="Net IRR" value={`${study.netIrrPercent.toFixed(1)}%`} />
        </div>
      </div>
    </div>
  );
}
