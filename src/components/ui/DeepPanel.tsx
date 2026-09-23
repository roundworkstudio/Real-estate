/**
 * Dashboard-chrome panel — the "investment app" surface from the mobile-kit
 * and mortgage-calculator references: solid deep blue, white text, room for
 * a headline figure and small controls. Deliberately solid, not a gradient
 * — see the note on --color-royal-deep in globals.css.
 */
export function DeepPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-royal-deep p-6 text-white shadow-card">
      {children}
    </div>
  );
}
