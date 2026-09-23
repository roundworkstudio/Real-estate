const services = [
  {
    name: "Buying",
    desc: "Sourcing, viewings, negotiation and closing.",
  },
  {
    name: "Selling",
    desc: "Valuation, marketing, and qualified buyer introductions.",
  },
  {
    name: "Letting",
    desc: "Tenant sourcing, contracts, and ongoing management.",
  },
  {
    name: "Investment",
    desc: "Yield analysis and off-plan positioning for investors.",
  },
];

/**
 * Full-bleed background image — real photography (see
 * directives/prepare_media.md), not decorative stock. Dark scrim behind
 * the text is a solid gradient, not glass, so contrast holds regardless
 * of what's in the frame — see directives/anti-slop-ui.md's contrast rule.
 *
 * Service cards use a translucent glass fill, which the same directive
 * permits specifically over photography — the case here. This is a
 * deliberate exception to "no container sprawl," scoped to this one
 * section, not a return to boxing every element in a card.
 */
export function Services() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/hero/ramhan-villa-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.45))",
        }}
      />

      <div className="relative">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Services
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md"
            >
              <div className="text-lg font-medium text-white">{s.name}</div>
              <p className="mt-2 text-sm text-white/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
