/**
 * LAYOUT FILLER — not real testimonials. Attribution uses a role noun
 * instead of a surname ("A. Buyer") specifically so this can't be
 * mistaken for a real endorsement if it ever slipped into a screenshot —
 * directives/anti-slop-ui.md requires named, attributed testimonials, and
 * fabricating a plausible name would cross into inventing a person's
 * endorsement. Replace with the 4-8 real ones per
 * docs/client-inputs-required.md.
 */
const testimonials = [
  {
    quote:
      "Placeholder quote copy standing in for a real testimonial — length and tone representative of what will replace it.",
    attribution: "A. Buyer, Saadiyat Island",
  },
  {
    quote:
      "Placeholder quote copy standing in for a real testimonial — this one a little shorter, to test layout variance.",
    attribution: "S. Seller, Yas Island",
  },
  {
    quote:
      "Placeholder quote copy standing in for a real testimonial, this time from an investor's point of view rather than an owner-occupier's.",
    attribution: "M. Investor, Al Reem Island",
  },
];

export function Testimonials() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
        What clients say
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.attribution}>
            <p className="text-slate/80">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-4 text-sm font-medium text-slate/50">
              {t.attribution}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
