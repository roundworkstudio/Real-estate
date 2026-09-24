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
 */
import { Reveal } from "@/components/ui/Reveal";

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

export function VideoTour() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <Reveal>
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
          See it before you visit
        </h2>
        <p className="mt-4 max-w-md text-slate/70">
          Walkthroughs shot on site, not stock footage or a rendered fly-
          through.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {clips.map((c, i) => (
          <Reveal
            key={c.src}
            delayMs={i * 100}
            className="hover-lift mx-auto w-full max-w-xs overflow-hidden rounded-2xl shadow-card"
          >
            <video
              className="aspect-[9/16] w-full object-cover"
              src={c.src}
              poster={c.poster}
              muted
              loop
              playsInline
              autoPlay
              controls
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
