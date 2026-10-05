import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PLACEHOLDER_WHATSAPP_URL } from "@/lib/site-config";
import { AreaGuideCard, type AreaGuide } from "./AreaGuideCard";
import { MobileAreasCarousel } from "./MobileAreasCarousel";

/**
 * LAYOUT FILLER — yield ranges and price-from figures are representative
 * market estimates, not verified data. Replace with real numbers from the
 * client or a current REIDIN/Bayut report before this goes live.
 * docs/client-inputs-required.md has the outstanding data request.
 */
const areas: AreaGuide[] = [
  {
    name: "Saadiyat Island",
    city: "Abu Dhabi",
    image: "/media/area-guides/saadiyat-island.jpg",
    imageAlt: "The Louvre Abu Dhabi dome beside the water on Saadiyat Island",
    yieldRange: "5–6%",
    priceFromAed: 3_500_000,
    tag: "Cultural district",
    description:
      "Louvre, NYU Abu Dhabi, and low-density villa plots. Long-term capital preservation in a supply-constrained master plan.",
  },
  {
    name: "Yas Island",
    city: "Abu Dhabi",
    image: "/media/area-guides/yas-island.jpg",
    imageAlt: "Yas Marina Circuit on Yas Island",
    yieldRange: "6–7%",
    priceFromAed: 1_800_000,
    tag: "Leisure & lifestyle",
    description:
      "F1 circuit, theme parks, and high-occupancy short-let demand. One of Abu Dhabi's strongest STR markets.",
  },
  {
    name: "Al Reem Island",
    city: "Abu Dhabi",
    image: "/media/area-guides/al-reem-island.jpg",
    imageAlt: "Al Reem Island skyline beyond Abu Dhabi's mangroves",
    yieldRange: "7–8%",
    priceFromAed: 900_000,
    tag: "Urban residential",
    description:
      "High-density towers, professional-renter demand, and one of the city's most consistent gross yield bands.",
  },
  {
    name: "Hudayriyat Island",
    city: "Abu Dhabi",
    image: "/media/area-guides/hudayriyat-island.jpg",
    imageAlt: "The illuminated waterfront at Hudayriyat Island after sunset",
    yieldRange: "5–6%",
    priceFromAed: 8_700_000,
    tag: "Emerging waterfront",
    description:
      "MODON master-planned island, Wadeem Gardens villas — early-entry pricing ahead of full infrastructure delivery.",
  },
  {
    name: "Dubai Marina",
    city: "Dubai",
    image: "/media/area-guides/dubai-marina.jpg",
    imageAlt: "Dubai Marina towers and waterfront at dusk",
    yieldRange: "6–7%",
    priceFromAed: 1_200_000,
    tag: "Established waterfront",
    description:
      "Highly liquid, strong short-let demand, large pool of qualified buyers and institutional tenants.",
  },
  {
    name: "Downtown Dubai",
    city: "Dubai",
    image: "/media/area-guides/downtown-dubai.jpg",
    imageAlt: "The Burj Khalifa rising above Downtown Dubai",
    yieldRange: "5–6%",
    priceFromAed: 1_500_000,
    tag: "Trophy address",
    description:
      "Burj Khalifa outlook and Emaar's flagship district. Rental demand anchored by tourism and corporate tenancies.",
  },
];

export function AreasPreview() {
  return (
    <section className="px-6 py-6 sm:px-10 sm:py-20">
      <Reveal>
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
          Area guides
        </h2>
        <p className="mt-2 max-w-xl text-slate/60">
          A practical guide to key communities across Abu Dhabi and Dubai,
          with indicative yields, entry prices, and local context.
        </p>
      </Reveal>

      <MobileAreasCarousel areas={areas} />

      <div className="mt-10 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area, i) => (
          <Reveal key={area.name} delayMs={i * 60} className="h-full">
            <AreaGuideCard area={area} />
          </Reveal>
        ))}
      </div>

      <Reveal delayMs={300}>
        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
          <p className="text-sm text-slate/60">
            Researching a community or building not shown here?
          </p>
          <WhatsAppButton
            href={PLACEHOLDER_WHATSAPP_URL}
            variant="light"
            compact
            className="shrink-0"
          >
            Ask on WhatsApp
          </WhatsAppButton>
        </div>
      </Reveal>

      <Reveal delayMs={360}>
        <details className="mt-6 max-w-3xl text-xs leading-relaxed text-slate/45">
          <summary className="w-fit cursor-pointer transition-colors hover:text-slate/65">
            Photo credits
          </summary>
          <p className="mt-2">
            Unsplash photography by{" "}
            <a
              href="https://unsplash.com/photos/xeFDlGub15M"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-slate/65"
            >
              Nazar Skalatsky
            </a>
            ,{" "}
            <a
              href="https://unsplash.com/photos/Z1Y4cvcy7uM"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-slate/65"
            >
              Shubham Darlinge
            </a>
            ,{" "}
            <a
              href="https://unsplash.com/photos/NK_P83I72qc"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-slate/65"
            >
              Janith Devinda
            </a>
            ,{" "}
            <a
              href="https://unsplash.com/photos/CwJb7ly-iqc"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-slate/65"
            >
              Ashim D&apos;Silva
            </a>
            , and{" "}
            <a
              href="https://unsplash.com/photos/Fr6zexbmjmc"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-slate/65"
            >
              David Rodrigo
            </a>
            . Hudayriyat Island by{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Hudayriyat_Island.jpg"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-slate/65"
            >
              Slywire
            </a>{" "}
            via Wikimedia Commons, licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-slate/65"
            >
              CC BY-SA 4.0
            </a>
            .
          </p>
        </details>
      </Reveal>
    </section>
  );
}
