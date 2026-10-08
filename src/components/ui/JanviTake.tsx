import Image from "next/image";

/** Janvi's short opinion on a project, with her photo. `bubble` renders a
 * speech bubble pointing up at whatever sits above it. */
export function JanviTake({
  quote,
  variant = "inline",
  className = "",
}: {
  quote: string;
  variant?: "inline" | "bubble";
  className?: string;
}) {
  const bubble = variant === "bubble";
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
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover object-top ring-2 ring-white"
      />
      <div>
        <p className="text-xs font-medium text-slate/70">Janvi&rsquo;s take</p>
        <blockquote className="mt-0.5 text-sm italic leading-relaxed text-slate/80">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </div>
    </figure>
  );
}
