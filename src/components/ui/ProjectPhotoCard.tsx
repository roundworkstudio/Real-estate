import Image from "next/image";

/** Shared shell for every project card on the Projects page: the photo
 * fills the card, status badges sit on the photo, and the details sit in a
 * tinted glass panel below a fixed band of photo. The card grows with its
 * content, so the badges are never squeezed by a tall panel. */
export function ProjectPhotoCard({
  image,
  sizes = "100vw",
  badge,
  isSample = false,
  className = "",
  children,
}: {
  image: { src: string; alt: string };
  sizes?: string;
  badge: React.ReactNode;
  isSample?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-[2rem] shadow-[0_24px_50px_-28px_rgba(58,45,40,.7)] ${className}`}
    >
      <Image src={image.src} alt={image.alt} fill quality={90} sizes={sizes} className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate/55 via-transparent via-50% to-slate/15" />
      <span className="liquid-glass liquid-glass--tint absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white">
        {badge}
      </span>
      {isSample && (
        <span className="liquid-glass liquid-glass--tint absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-medium text-white">
          Sample
        </span>
      )}
      <div className="relative mt-auto px-3 pb-3 pt-40">
        <div className="liquid-glass liquid-glass--tint rounded-[1.5rem] p-4 text-white">{children}</div>
      </div>
    </article>
  );
}

export const PROJECT_CARD_PRIMARY =
  "flex items-center justify-center whitespace-nowrap rounded-full bg-white px-3 py-2.5 text-sm font-medium text-slate transition-colors hover:bg-white/90";
