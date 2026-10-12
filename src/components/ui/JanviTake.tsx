import Image from "next/image";
import { AnnotatedText } from "@/components/ui/annotated-text";

/** Janvi's short opinion on a project, with her photo. `bubble` renders a
 * speech bubble pointing up at whatever sits above it. `highlight` draws a
 * hand-drawn underline under that phrase of the quote as it scrolls in. */
export function JanviTake({
  quote,
  highlight,
  variant = "inline",
  size = "sm",
  className = "",
}: {
  quote: string;
  highlight?: string;
  variant?: "inline" | "bubble";
  size?: "sm" | "lg";
  className?: string;
}) {
  const bubble = variant === "bubble";
  const at = highlight ? quote.indexOf(highlight) : -1;
  const body =
    at >= 0 && highlight ? (
      <>
        {quote.slice(0, at)}
        <AnnotatedText variant="underline" color="text-sovereign" delay={0.3}>
          {highlight}
        </AnnotatedText>
        {quote.slice(at + highlight.length)}
      </>
    ) : (
      quote
    );

  return (
    <figure
      className={`relative flex items-start gap-3 ${bubble ? "liquid-glass-light rounded-2xl px-4 py-3.5" : ""} ${className}`}
    >
      {bubble && (
        <span
          aria-hidden
          className="absolute -top-[7px] left-8 h-3 w-3 rotate-45 rounded-tl-[3px] border-l border-t border-white bg-white"
        />
      )}
      <Image
        src="/media/people/janvi-about.jpg"
        alt=""
        width={size === "lg" ? 56 : 40}
        height={size === "lg" ? 56 : 40}
        className={`${size === "lg" ? "h-14 w-14" : "h-10 w-10"} shrink-0 rounded-full object-cover object-top ring-2 ring-white`}
      />
      <div>
        <p className="text-xs font-medium text-slate/70">Janvi&rsquo;s take</p>
        <blockquote className={`mt-0.5 italic leading-relaxed text-slate/80 ${size === "lg" ? "text-lg sm:text-xl" : "text-sm"}`}>
          &ldquo;{body}&rdquo;
        </blockquote>
      </div>
    </figure>
  );
}
