import { ChevronDown } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { HeroVideo } from "./HeroVideo";
import { AISearchBar } from "./AISearchBar";

/**
 * SITEMAP.md: "property photography carries it. One concrete positioning
 * line, one primary CTA (Book a call), one secondary (View listings). No
 * eyebrow label above the headline." Footage is real (converted client
 * footage — see directives/prepare_media.md); the search bar is an "ask
 * AI" shell, not functional — see AISearchBar's own note for what that
 * means and why.
 *
 * Video source is vertical (1080x1920, see HANDOVER.md — almost all of her
 * footage is). object-cover on a wide hero crops it to a narrow centre
 * strip; that's a known, accepted trade-off here, not an oversight. Swap
 * for landscape footage the moment any exists.
 */
export function Hero() {
  return (
    <section className="relative flex h-[92vh] min-h-[640px] flex-col justify-end overflow-hidden">
      <HeroVideo
        src="/media/hero/ramhan-villa-hero.mp4"
        poster="/media/hero/ramhan-villa-hero.jpg"
      />
      {/* Two-layer scrim: bottom-up for the search bar, left-to-right for
          headline legibility over a bright sky/light-facade photo. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgb(0 0 0 / 0.6), rgb(0 0 0 / 0.1) 45%, rgb(0 0 0 / 0.15)), linear-gradient(to right, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.1) 55%, rgb(0 0 0 / 0) 80%)",
        }}
      />

      <Nav />

      <div className="relative px-6 pb-14 pt-24 sm:px-10 sm:pb-16 sm:pt-32">
        <h1 className="max-w-2xl text-4xl font-semibold text-white sm:text-6xl">
          Abu Dhabi and Dubai real estate, presented like an investment.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/80">
          Yield, price per sqft, and payment terms alongside every listing,
          not buried in a PDF.
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="primary">Book a call</Button>
          <Button variant="ghost-light">View listings</Button>
        </div>
      </div>

      <div className="mb-10 sm:mb-14">
        <AISearchBar />
      </div>

      <a
        href="#numbers"
        aria-label="Scroll to see more"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/70 transition-colors hover:text-white sm:block"
      >
        <ChevronDown size={28} />
      </a>
    </section>
  );
}
