/**
 * Real footage is vertical (see HANDOVER.md and directives/prepare_media.md)
 * — this section is built around that shape rather than fighting it:
 * portrait clips in contained frames, not a cropped wide background.
 * Additive to SITEMAP.md's confirmed homepage order, not a replacement for
 * any listed section — demonstrating real video use as asked.
 *
 * Three clips, all real on-site footage, not three angles of the same
 * clip. The two added alongside the original tour clip are converted
 * from Active Projects/Ramhan Villa/Footage/RAW Footage/Property Visuals/
 * IMG_1829.mov and IMG_1845.mov — see directives/prepare_media.md for the
 * conversion tool and where source footage lives.
 *
 * Desktop videos show their posters and load metadata until a visitor
 * chooses one to play. Starting three portrait videos together cost both
 * network and decoding time. Mobile keeps ambient autoplay for only the
 * one card at the front of the swipe stack.
 */
import { Reveal } from "@/components/ui/Reveal";
import { VideoSwipeStack } from "@/components/home/VideoSwipeStack";

const clips = [
  {
    src: "/media/video/ramhan-villa-tour.mp4",
    poster: "/media/listings/ramhan-villa-1.jpg",
  },
  {
    src: "/media/video/ramhan-villa-tour-2.mp4",
    poster: "/media/listings/ramhan-villa-3.jpg",
  },
  {
    src: "/media/video/ramhan-villa-tour-3.mp4",
    poster: "/media/listings/ramhan-villa-5.jpg",
  },
];

function TourClip({ src, poster }: { src: string; poster: string }) {
  return (
    <video
      className="aspect-[9/16] w-full object-cover"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      controls
    />
  );
}

export function VideoTour() {
  return (
    <section className="px-6 py-10 sm:px-10 sm:py-20">
      <Reveal>
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
          See it before you visit
        </h2>
        <p className="mt-4 max-w-md text-slate/70">
          Walkthroughs shot on site, not stock footage or a rendered fly-
          through.
        </p>
      </Reveal>

      {/* Mobile: swipe stack */}
      <div className="mt-10 sm:hidden">
        <VideoSwipeStack clips={clips} />
      </div>

      {/* Desktop: 3-column grid with native controls */}
      <div className="mt-10 hidden rounded-3xl bg-slate/5 p-8 sm:block lg:p-12">
        <div className="grid grid-cols-3 gap-6 lg:gap-8">
          {clips.map((c, i) => (
            <Reveal
              key={c.src}
              delayMs={i * 100}
              className="hover-lift overflow-hidden rounded-2xl shadow-card"
            >
              <TourClip src={c.src} poster={c.poster} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
