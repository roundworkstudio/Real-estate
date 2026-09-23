/**
 * LAYOUT FILLER — real UAE place names used as generic filler text, not a
 * claim about her actual coverage. "How many communities she covers" is
 * an explicit open client input (docs/client-inputs-required.md) that
 * changes whether /areas is three pages or fifteen — this list exists to
 * test chip-wrap layout at a plausible count, nothing more.
 *
 * Background is real photography (a waterfront dock — see
 * directives/prepare_media.md). The chips use a translucent white fill
 * with blur, which directives/anti-slop-ui.md's glass rules permit only
 * over photography — exactly the case here.
 */
const areas = [
  "Saadiyat Island",
  "Yas Island",
  "Al Reem Island",
  "Al Raha Beach",
  "Ramhan Island",
  "Downtown Dubai",
  "Dubai Marina",
  "Palm Jumeirah",
];

export function AreasServed() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/listings/ramhan-villa-6.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(0 0 0 / 0.35), rgb(0 0 0 / 0.5))",
        }}
      />

      <div className="relative">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Areas served
        </h2>
        <p className="mt-2 text-sm text-white/60">
          Illustrative list — actual coverage pending, see
          docs/client-inputs-required.md.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {areas.map((a) => (
            <a
              key={a}
              href="/areas"
              className="rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              {a}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
