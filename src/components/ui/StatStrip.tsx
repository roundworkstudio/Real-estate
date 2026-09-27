export type StatStripItem = {
  value: string;
  label: string;
  /** Highlights the value in the sovereign (positive/growth) colour —
   * same convention as yield figures elsewhere on the site. */
  accent?: boolean;
};

/**
 * Horizontal row of compact stat call-outs — value on top, uppercase
 * label below — sitting under a page header's description line so the
 * facts a buyer actually needs (price, payment plan split, key dates)
 * are visible before any scrolling. Modelled on a client-supplied
 * reference (a competitor's per-project "launch briefing" page).
 *
 * `theme="dark"` is for use over a hero image (white text, translucent
 * divider); `theme="light"` for the page's own background.
 *
 * A fixed two-column grid below `sm`, reverting to a free-flowing row
 * above it — fixed 2026-09-27 (mobile alignment audit). With 4-5 items of
 * uneven width, plain `flex flex-wrap` let each row's own content push its
 * second column to a different x position (a long price range in row one,
 * a short value in row two), so the two "columns" never actually lined up
 * — a grid forces both rows to share the same column width instead.
 */
export function StatStrip({
  items,
  theme = "light",
  className = "",
}: {
  items: StatStripItem[];
  theme?: "light" | "dark";
  className?: string;
}) {
  const borderColor = theme === "dark" ? "border-white/20" : "border-slate/10";
  const labelColor = theme === "dark" ? "text-white/60" : "text-slate/50";
  const valueColor = theme === "dark" ? "text-white" : "text-slate";

  return (
    <div
      className={`grid grid-cols-2 gap-x-8 gap-y-4 border-t sm:flex sm:flex-wrap ${borderColor} pt-6 ${className}`}
    >
      {items.map((item) => (
        <div key={item.label}>
          <div
            className={`text-lg font-semibold tabular-nums sm:text-xl ${
              item.accent ? "text-sovereign" : valueColor
            }`}
          >
            {item.value}
          </div>
          <div
            className={`mt-1 text-xs font-medium tracking-wide uppercase ${labelColor}`}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
