/**
 * Real footage is vertical (see HANDOVER.md and directives/prepare_media.md)
 * — this section is built around that shape rather than fighting it:
 * a portrait clip in a contained frame, not a cropped wide background.
 * Additive to SITEMAP.md's confirmed homepage order, not a replacement for
 * any listed section — demonstrating real video use as asked.
 */
export function VideoTour() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
            See it before you visit
          </h2>
          <p className="mt-4 max-w-md text-slate/70">
            Walkthroughs shot on site, not stock footage or a rendered fly-
            through.
          </p>
        </div>

        <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl shadow-card">
          <video
            className="aspect-[9/16] w-full object-cover"
            src="/media/video/ramhan-villa-tour.mp4"
            poster="/media/listings/ramhan-villa-1.jpg"
            muted
            loop
            playsInline
            autoPlay
            controls
          />
        </div>
      </div>
    </section>
  );
}
