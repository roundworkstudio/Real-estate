import { ChevronDown } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { PLACEHOLDER_TEL_URL } from "@/lib/site-config";
import { HeroVideo } from "./HeroVideo";
import { HeroShimmerHeading } from "./HeroShimmerHeading";
import { AISearchBar } from "./AISearchBar";

/**
 * SITEMAP.md: "property photography carries it. One concrete positioning
 * line, one primary CTA (Book a call), one secondary (View listings). No
 * eyebrow label above the headline." Footage is real (converted client
 * footage — see directives/prepare_media.md); the search bar is an "ask
 * AI" shell, not functional — see AISearchBar's own note for what that
 * means and why.
 *
 * Hero clip swapped 2026-09-26: the villa-entrance clip (still used
 * elsewhere — see Services.tsx and sample-properties.ts's gallery arrays,
 * which is why that file wasn't deleted) for a golden-hour shot through
 * the living room's glass doors onto the infinity pool and waterfront,
 * sourced from the same RAW Footage/Property Visuals set on the SSD
 * (IMG_1838.mov) and converted at native resolution (PresetHighestQuality,
 * not the default Preset1920x1080 — that preset's box would have
 * downscaled this portrait source, the exact mistake HANDOVER.md flagged
 * for the previous hero clip).
 *
 * Two-clip sequence added 2026-09-27: the poolview clip (13s) is cut short
 * at 8s and followed by the front-entrance clip (the original hero clip,
 * exactly 8s, still on disk at ramhan-villa-hero.mp4) before looping back
 * — see HeroVideo.tsx for the switch/loop logic. Requested as "shorten the
 * hero video, then show the villa from the front."
 *
 * Extended to four clips same day: HeroVideo generalised from a fixed
 * two-clip component to an ordered `clips` sequence, and two more source
 * clips from the same RAW Footage/Property Visuals set were added —
 * IMG_1826.mov (facade approach) and "IMG_1840 2.mov" (pool/waterfront with
 * the UAE flag), both 16s sources converted at PresetHighestQuality and
 * capped at 8s in the loop via `switchAt`, same as the poolview clip.
 *
 * Fifth clip added 2026-09-27: IMG_1851.mov (side courtyard/annex, open
 * door), same source set. The web copy is physically trimmed to the eight
 * seconds used in this loop and all hero sources are fast-start H.264 at
 * 1080x1920, avoiding the original 149MB aggregate media payload.
 *
 * Current loop order: interior poolview -> facade approach -> side
 * courtyard -> front entrance -> pool/flag waterfront -> back to poolview.
 *
 * Video source is vertical (1080x1920, see HANDOVER.md — almost all of her
 * footage is). object-cover on a wide hero crops it to a narrow centre
 * strip; that's a known, accepted trade-off here, not an oversight. Swap
 * for landscape footage the moment any exists.
 */
const HERO_CLIPS = [
  {
    src: "/media/hero/ramhan-villa-poolview-hero.mp4",
    poster: "/media/hero/ramhan-villa-poolview-hero.jpg",
    switchAt: 8,
  },
  {
    src: "/media/hero/ramhan-villa-facade-hero.mp4",
    poster: "/media/hero/ramhan-villa-facade-hero.jpg",
    switchAt: 8,
  },
  {
    src: "/media/hero/ramhan-villa-courtyard-hero.mp4",
    poster: "/media/hero/ramhan-villa-courtyard-hero.jpg",
    switchAt: 8,
  },
  {
    src: "/media/hero/ramhan-villa-hero.mp4",
    poster: "/media/hero/ramhan-villa-hero.jpg",
  },
  {
    src: "/media/hero/ramhan-villa-poolflag-hero.mp4",
    poster: "/media/hero/ramhan-villa-poolflag-hero.jpg",
    switchAt: 8,
  },
];

export function Hero() {
  return (
    <section className="relative flex h-[calc(92vh+4rem)] min-h-[704px] flex-col justify-end overflow-hidden sm:h-[92vh] sm:min-h-[640px]">
      <HeroVideo clips={HERO_CLIPS} />
      {/* Two-layer scrim: bottom-up for the search bar, left-to-right for
          headline legibility over a bright sky/light-facade photo. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgb(0 0 0 / 0.6), rgb(0 0 0 / 0.1) 45%, rgb(0 0 0 / 0.15)), linear-gradient(to right, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.1) 55%, rgb(0 0 0 / 0) 80%)",
        }}
      />

      <Nav compactStyle />

      <div className="relative px-6 pb-14 pt-24 sm:px-10 sm:pb-10 sm:pt-32">
        <HeroShimmerHeading />
        <p className="mt-4 max-w-xl text-lg text-white/80">
          Yield, price per sqft, and payment terms alongside every listing,
          not buried in a PDF.
        </p>
        {/* Slightly glassy — backdrop-blur is only used here because these
            sit over moving video, the one context directives/anti-slop-ui.md
            permits it in; scoped via className rather than the shared
            Button variants, which are also used over flat backgrounds
            elsewhere where blur would be meaningless. */}
        <div className="mt-8 flex gap-3">
          <Button
            href={PLACEHOLDER_TEL_URL}
            variant="primary"
            className="border border-white/15 bg-royal/80 backdrop-blur-sm hover:bg-royal/70"
          >
            Book a call
          </Button>
          <Button
            href="/properties"
            variant="ghost-light"
            className="border border-white/20 backdrop-blur-sm"
          >
            View listings
          </Button>
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
