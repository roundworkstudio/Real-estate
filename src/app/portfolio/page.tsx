/**
 * Portfolio / track record — first rough draft of the page SITEMAP.md
 * already confirms ("/portfolio — Sold / past work, the track record").
 * No real closed deals exist to report yet, so the case study below is
 * explicitly and repeatedly labelled as a sample — see CaseStudyCard.
 * The deal map is stubbed rather than faked: it needs a map provider
 * decision and an API key neither of which exists yet.
 */
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { CaseStudyCard, type CaseStudy } from "@/components/tools/CaseStudyCard";
import { WhatsAppBanner } from "@/components/tools/WhatsAppBanner";

const sampleCaseStudy: CaseStudy = {
  title: "Waterfront villa, Ramhan Island",
  location: "Ramhan Island, Abu Dhabi",
  entryPriceAed: 6_400_000,
  entryDate: "2023",
  capitalOutlayAed: 350_000,
  yieldDuringHoldPercent: 6.4,
  exitPriceAed: 8_200_000,
  exitDate: "2025",
  equityMultiple: 1.42,
  netIrrPercent: 18.6,
  narrative: [
    "Sample thesis: acquired below the building average on a motivated-seller off-plan resale.",
    "Sample execution: light interior refresh and re-leased at a higher rent before listing for sale.",
    "Sample exit: sold within four months of listing to a move-up buyer.",
  ],
  // Frame grabs from video, see directives/prepare_media.md.
  beforeSrc: "/media/listings/ramhan-villa-7.jpg", // IMG_1827.mov — entrance
  afterSrc: "/media/listings/ramhan-villa-6.jpg", // IMG_1841.mov — waterfront dock at sunset
  isSample: true,
};

export default function PortfolioPage() {
  return (
    <main>
      <div className="relative bg-slate">
        <Nav />
        <div className="h-20" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <h1 className="text-3xl font-semibold text-slate sm:text-4xl">
          Portfolio
        </h1>
        <p className="mt-3 max-w-lg text-slate/70">
          The track record — sold and past work.
        </p>

        <div className="mt-12">
          <CaseStudyCard study={sampleCaseStudy} />
        </div>
      </section>

      {/* LAYOUT FILLER — see MapPlaceholder's own note for what's blocking
          the real thing (provider decision, API key, real deal geodata). */}
      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <h2 className="text-xl font-semibold text-slate">Deal map</h2>
        <div className="mt-6">
          <MapPlaceholder label="Interactive deal map" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <WhatsAppBanner />
      </section>

      <Footer />
    </main>
  );
}
