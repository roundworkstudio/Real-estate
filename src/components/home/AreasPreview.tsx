import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { PLACEHOLDER_WHATSAPP_URL } from "@/lib/site-config";

/**
 * LAYOUT FILLER — yield ranges and price-from figures are representative
 * market estimates, not verified data. Replace with real numbers from the
 * client or a current REIDIN/Bayut report before this goes live.
 * docs/client-inputs-required.md has the outstanding data request.
 */
const areas = [
  {
    name: "Saadiyat Island",
    city: "Abu Dhabi",
    yieldRange: "5–6%",
    priceFromAed: 3_500_000,
    tag: "Cultural district",
    description:
      "Louvre, NYU Abu Dhabi, and low-density villa plots. Long-term capital preservation in a supply-constrained master plan.",
  },
  {
    name: "Yas Island",
    city: "Abu Dhabi",
    yieldRange: "6–7%",
    priceFromAed: 1_800_000,
    tag: "Leisure & lifestyle",
    description:
      "F1 circuit, theme parks, and high-occupancy short-let demand. One of Abu Dhabi's strongest STR markets.",
  },
  {
    name: "Al Reem Island",
    city: "Abu Dhabi",
    yieldRange: "7–8%",
    priceFromAed: 900_000,
    tag: "Urban residential",
    description:
      "High-density towers, professional-renter demand, and one of the city's most consistent gross yield bands.",
  },
  {
    name: "Hudayriyat Island",
    city: "Abu Dhabi",
    yieldRange: "5–6%",
    priceFromAed: 8_700_000,
    tag: "Emerging waterfront",
    description:
      "MODON master-planned island, Wadeem Gardens villas — early-entry pricing ahead of full infrastructure delivery.",
  },
  {
    name: "Dubai Marina",
    city: "Dubai",
    yieldRange: "6–7%",
    priceFromAed: 1_200_000,
    tag: "Established waterfront",
    description:
      "Highly liquid, strong short-let demand, large pool of qualified buyers and institutional tenants.",
  },
  {
    name: "Downtown Dubai",
    city: "Dubai",
    yieldRange: "5–6%",
    priceFromAed: 1_500_000,
    tag: "Trophy address",
    description:
      "Burj Khalifa outlook and Emaar's flagship district. Rental demand anchored by tourism and corporate tenancies.",
  },
];

export function AreasPreview() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <Reveal>
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
          Areas we cover
        </h2>
        <p className="mt-2 max-w-xl text-slate/60">
          Abu Dhabi and Dubai. Indicative gross yield ranges and entry prices
          for the markets where we operate most actively.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area, i) => (
          <Reveal key={area.name} delayMs={i * 60}>
            <GlassCard className="rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-slate">
                    {area.name}
                  </div>
                  <div className="mt-0.5 text-xs text-slate/50">{area.city}</div>
                </div>
                <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-slate/70">
                  {area.tag}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate/70 leading-relaxed">
                {area.description}
              </p>
              <div className="mt-4 flex items-center gap-6 border-t border-slate/8 pt-4">
                <div>
                  <div className="text-xs text-slate/50">Gross yield</div>
                  <div className="mt-0.5 text-sm font-semibold text-sovereign">
                    {area.yieldRange}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate/50">From</div>
                  <div className="mt-0.5 text-sm font-semibold text-slate">
                    AED {area.priceFromAed.toLocaleString("en-AE")}
                  </div>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      <Reveal delayMs={300}>
        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
          <p className="text-sm text-slate/60">
            Want area-specific numbers on a building you&apos;re considering?
          </p>
          <a
            href={PLACEHOLDER_WHATSAPP_URL}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate/15 bg-white px-4 py-2 text-sm font-medium text-slate shadow-sm transition-colors hover:border-slate/25"
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-[#25D366]" />
            <MessageCircle size={15} className="text-slate/60" />
            Ask on WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}
