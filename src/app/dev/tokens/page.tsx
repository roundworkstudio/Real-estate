/**
 * Placeholder homepage. This is a token + primitive check, not a designed
 * page — see docs/what-worked.md ("breadth before depth"). No page here
 * should be polished until the whole site exists at rough fidelity, and no
 * visual work should proceed until docs/client-inputs-required.md is
 * answered.
 */
import { MetricCard } from "@/components/ui/MetricCard";
import { DeepPanel } from "@/components/ui/DeepPanel";
import { Button } from "@/components/ui/Button";

const swatches = [
  { name: "canvas", className: "bg-canvas", hex: "#FFFFFF", border: true },
  { name: "sand", className: "bg-sand", hex: "#F4EAD2" },
  { name: "royal", className: "bg-royal", hex: "#0055FF" },
  { name: "sovereign", className: "bg-sovereign", hex: "#00C853" },
  { name: "slate", className: "bg-slate", hex: "#1E293B" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate">
        Janvi Real Estate — build placeholder
      </h1>
      <p className="mt-2 text-slate/70">
        Provisional colour tokens only. No page design yet.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {swatches.map((s) => (
          <div key={s.name} className="flex flex-col gap-2">
            <div
              className={`h-20 rounded ${s.className} ${
                s.border ? "border border-slate/10" : ""
              }`}
            />
            <div className="text-sm">
              <div className="font-medium text-slate">{s.name}</div>
              <div className="text-slate/60">{s.hex}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-lg font-semibold text-slate">
        Fintech-dashboard primitives (rough)
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Average yield" value="6.8" unit="%" tone="positive" />
        <MetricCard label="Median price" value="2.1" unit="AED M" />
        <DeepPanel>
          <div className="text-sm text-white/60">Est. monthly return</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums">
            AED 12,400
          </div>
          <Button variant="primary" className="mt-4">
            Calculate
          </Button>
        </DeepPanel>
      </div>
    </main>
  );
}
