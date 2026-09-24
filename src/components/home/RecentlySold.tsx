import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

/**
 * LAYOUT FILLER — not real sales. Reuses the two real property photos
 * (see directives/prepare_media.md) with generic placeholder addresses
 * and invented sold prices, kept deliberately separate from
 * lib/sample-properties.ts so this never gets pulled into a real
 * inventory list by accident. Replace with real closed sales per
 * docs/client-inputs-required.md.
 *
 * Rounded end to end (photo + text panel, one shape) — same explicit
 * override of anti-slop-ui.md's "no card for listings" rule PropertyCard
 * now carries, see that component's note.
 */
const soldExamples = [
  {
    address: "Placeholder Tower, Al Reem Island",
    priceAed: 3_100_000,
    image: "/media/listings/ramhan-villa-3.jpg", // dining area
  },
  {
    address: "Placeholder Villa, Saadiyat Island",
    priceAed: 7_450_000,
    image: "/media/listings/ramhan-villa-5.jpg", // kitchen
  },
  {
    address: "Placeholder Residence, Yas Island",
    priceAed: 2_680_000,
    image: "/media/listings/ramhan-villa-4.jpg", // waterfront terrace at sunset
  },
];

export function RecentlySold() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <Reveal>
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
          Recently sold
        </h2>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
        {soldExamples.map((s, i) => (
          <Reveal key={s.address} delayMs={i * 100}>
            <GlassCard
              maxDeg={5}
              className="overflow-hidden rounded-2xl bg-canvas shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.address}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-3 top-3 rounded-full bg-slate/80 px-2.5 py-1 text-xs font-medium text-white">
                  Sold
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="text-sm font-medium text-slate">
                  AED {s.priceAed.toLocaleString("en-AE")}
                </div>
                <div className="text-sm text-slate/60">{s.address}</div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
