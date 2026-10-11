import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Hand-off card between the Properties and Projects sides of the site: a
 * photo, one line of context and a single link. Same component in every
 * direction so moving between homes and projects always looks the same.
 */
export function ExploreNext({
  eyebrow,
  title,
  body,
  href,
  cta,
  image,
  className = "",
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  image: { src: string; alt: string };
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group liquid-glass-light flex flex-col overflow-hidden rounded-[2rem] shadow-[0_18px_45px_-32px_rgba(58,45,40,.6)] transition duration-500 hover:-translate-y-0.5 sm:flex-row sm:items-stretch ${className}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden sm:aspect-auto sm:w-2/5 sm:shrink-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 640px) 40vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center p-5 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-royal">{eyebrow}</p>
        <h2 className="mt-1.5 text-xl font-semibold leading-tight text-slate sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate/70">{body}</p>
        <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-royal-deep px-4 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-royal">
          {cta}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
