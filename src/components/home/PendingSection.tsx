/**
 * Honest placeholder for sections SITEMAP.md calls for that would
 * otherwise require inventing client-specific facts to fill: a headshot
 * and bio, named testimonials, closed-sale proof. Fabricating any of
 * those is worse than an empty rough slot — see directives/anti-slop-ui.md
 * ("real numbers, real sold listings, named testimonials") and
 * docs/client-inputs-required.md for what's actually needed to fill this.
 */
export function PendingSection({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <section className="px-6 py-16 sm:px-10">
      <div className="rounded-2xl border border-dashed border-slate/20 p-10 text-center">
        <div className="text-sm font-medium text-slate/60">{title}</div>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate/40">{note}</p>
      </div>
    </section>
  );
}
