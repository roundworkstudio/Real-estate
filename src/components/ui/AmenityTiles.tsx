import { Dumbbell, Route, Sailboat, Sparkles, Trees, Waves } from "lucide-react";

export function amenityIcon(amenity: string, size = 13) {
  const a = amenity.toLowerCase();
  if (a.includes("pool")) return <Waves size={size} />;
  if (a.includes("gym")) return <Dumbbell size={size} />;
  if (a.includes("garden") || a.includes("park")) return <Trees size={size} />;
  if (a.includes("spine") || a.includes("path") || a.includes("walk")) return <Route size={size} />;
  if (a.includes("marina") || a.includes("waterfront")) return <Sailboat size={size} />;
  return <Sparkles size={size} />;
}

export function AmenityTiles({ amenities, className = "" }: { amenities: string[]; className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-2 ${className}`}>
      {amenities.map((amenity, i) => (
        <li
          key={amenity}
          className={`liquid-glass-light flex flex-col gap-2.5 rounded-2xl p-4 text-sm leading-snug text-slate/80 ${
            i === amenities.length - 1 && amenities.length % 2 === 1 ? "col-span-2" : ""
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-royal-deep">
            {amenityIcon(amenity, 15)}
          </span>
          <span>{amenity}</span>
        </li>
      ))}
    </ul>
  );
}
