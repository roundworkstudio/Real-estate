import { MapPin } from "lucide-react";

/**
 * LAYOUT FILLER, not a real map. Real map (provider TBD — Mapbox vs
 * Google Maps, see app/portfolio/page.tsx) needs an API key and real
 * location data, neither of which exist yet. This is a static mock at
 * the right aspect ratio so surrounding layout can be judged now.
 */
export function MapPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-sand sm:aspect-[21/9]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30,41,59,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.06) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <div className="flex flex-col items-center gap-2 text-slate/40">
        <MapPin size={28} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
