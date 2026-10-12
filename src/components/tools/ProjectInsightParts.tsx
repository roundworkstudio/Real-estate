/**
 * Shared pieces for the project page's three insight tabs (payment plan,
 * rental yield, 5-year growth) so they read as one set: a choice row, one
 * headline answer with its supporting numbers, then the detail.
 */

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-slate/[0.05] p-1 shadow-[inset_0_1px_2px_rgb(46_36_32/0.08)]"
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors sm:px-4 sm:text-sm ${
            value === o.id ? "liquid-pill text-white" : "text-slate/65 hover:text-slate"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A fixed label where the other tabs have a choice, so all three open
 * the same way. */
export function InsightTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex rounded-full bg-slate/[0.05] px-3.5 py-2 text-[13px] font-medium text-slate sm:px-4 sm:text-sm shadow-[inset_0_1px_2px_rgb(46_36_32/0.08)]">
      {children}
    </p>
  );
}

export function InsightHeadline({
  value,
  caption,
  stats,
}: {
  value: React.ReactNode;
  caption: string;
  stats: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div className="mt-8 flex flex-col gap-6 border-b border-slate/10 pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-4xl font-semibold leading-none tabular-nums text-slate sm:text-5xl">{value}</p>
        <p className="mt-3 text-sm text-slate/60">{caption}</p>
      </div>
      <dl className="flex flex-wrap gap-x-8 gap-y-4 md:mb-0.5">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-xs text-slate/55">{s.label}</dt>
            <dd className="mt-1.5 whitespace-nowrap text-lg font-semibold leading-5 tabular-nums text-slate">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** A single stacked bar with a legend underneath, each row carrying its
 * swatch and amount, so the split can be read without a chart axis. */
export function SplitBar({
  segments,
}: {
  segments: { label: string; value: number; display: string; color: string; emphasis?: boolean }[];
}) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0) || 1;
  return (
    <div>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-slate/5">
        {segments.map((s) =>
          s.value > 0 ? (
            <span
              key={s.label}
              className="h-full transition-[width] duration-300 ease-out first:rounded-l-full last:rounded-r-full"
              style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            />
          ) : null,
        )}
      </div>
      <dl className="mt-4">
        {segments.map((s) => (
          <div
            key={s.label}
            className="flex items-baseline justify-between gap-4 border-b border-slate/10 py-3 text-sm leading-5 last:border-0"
          >
            <dt className={`flex items-start gap-2.5 ${s.emphasis ? "font-medium text-slate" : "text-slate/60"}`}>
              <span aria-hidden className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
              {s.label}
            </dt>
            <dd className={`shrink-0 whitespace-nowrap tabular-nums ${s.emphasis ? "font-semibold text-slate" : "font-medium text-slate"}`}>
              {s.display}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Vertical payment timeline. Each connector runs from its own dot's centre
 * to the next dot's centre (label line-height 20px, so centres sit at 10px).
 * When `continues`, the last connector fades out to hint at hidden rows. */
export function PaymentSchedule({
  items,
  continues = false,
  onShowAll,
  totalCount,
}: {
  items: { label: string; amount: React.ReactNode; percent: number }[];
  continues?: boolean;
  onShowAll?: () => void;
  totalCount?: number;
}) {
  return (
    <>
      <ol className="mt-4">
        {items.map((m, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="relative pb-5 pl-6 last:pb-0">
              {!last && <span aria-hidden className="absolute -bottom-2.5 left-[3.5px] top-2.5 w-px bg-slate/15" />}
              {last && continues && (
                <span aria-hidden className="absolute -bottom-5 left-[3.5px] top-2.5 w-px bg-gradient-to-b from-slate/15 to-transparent" />
              )}
              <span aria-hidden className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-royal" />
              <div className="text-sm leading-5 text-slate/60">{m.label}</div>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="text-lg font-semibold tabular-nums text-slate">{m.amount}</span>
                <span className="text-xs tabular-nums text-slate/50">{m.percent}%</span>
              </div>
            </li>
          );
        })}
      </ol>
      {continues && onShowAll && (
        <button
          type="button"
          onClick={onShowAll}
          className="ml-6 mt-4 text-sm font-medium text-royal underline-offset-4 hover:underline"
        >
          Show all {totalCount} payments
        </button>
      )}
    </>
  );
}

export function InsightNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-8 max-w-3xl text-xs leading-relaxed text-slate/45">{children}</p>;
}
