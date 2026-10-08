import { cn } from "@/lib/utils";

const W = 44;
const H = 76;
const L = 11;
const RIGHT = W - L;
const SPRING = 36;
const BASE = 66;
const SPAN = RIGHT - L;
const APEX = SPRING - SPAN * Math.sin(Math.PI / 3);

/** Equilateral pointed arch — each side is an arc of radius equal to the span. */
const ARCH = `M${L} ${BASE}V${SPRING}A${SPAN} ${SPAN} 0 0 1 ${W / 2} ${APEX.toFixed(2)}A${SPAN} ${SPAN} 0 0 1 ${RIGHT} ${SPRING}V${BASE}Z`;

/**
 * Arcade of Emirati pointed-arch niches (Al Fahidi / barjeel-house
 * vernacular): carved plaster wall, shadowed recess, a fine mashrabiya
 * lattice inside each arch and a ledge beneath. Decorative only.
 */
export function ArchPattern({
  id = "arches",
  className,
}: {
  id?: string;
  className?: string;
}) {
  const recess = `${id}-recess`;
  const lattice = `${id}-lattice`;
  const clip = `${id}-clip`;
  return (
    <svg aria-hidden className={cn("pointer-events-none", className)}>
      <defs>
        <linearGradient id={recess} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f7262" />
          <stop offset="0.45" stopColor="#b0917f" />
          <stop offset="1" stopColor="#cdb39a" />
        </linearGradient>
        <pattern id={lattice} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0H6M0 0V6" stroke="#f3ebe0" strokeOpacity="0.55" strokeWidth="0.8" fill="none" />
        </pattern>
        <clipPath id={clip}>
          <path d={ARCH} />
        </clipPath>
        <pattern id={id} width={W} height={H} patternUnits="userSpaceOnUse">
          <rect width={W} height={H} fill="#efe6da" />

          <path d={ARCH} transform="translate(-1.2 -1.2)" fill="none" stroke="#fdfaf5" strokeWidth="2" />
          <path d={ARCH} transform="translate(1 1)" fill="none" stroke="#b9a692" strokeOpacity="0.7" strokeWidth="1.4" />

          <path d={ARCH} fill={`url(#${recess})`} />
          <g clipPath={`url(#${clip})`}>
            <rect x={L} y={APEX} width={SPAN} height={BASE - APEX} fill={`url(#${lattice})`} />
            <rect x={L} y={APEX} width="3" height={BASE - APEX} fill="#3a2d28" opacity="0.18" />
          </g>

          <rect x={L - 3} y={BASE} width={SPAN + 6} height="3" fill="#dccdbb" />
          <rect x={L - 3} y={BASE} width={SPAN + 6} height="1" fill="#fdfaf5" />
          <rect x={L - 3} y={BASE + 3} width={SPAN + 6} height="1" fill="#a8927c" opacity="0.6" />

          {[0, W].map((x) => (
            <g key={x}>
              <rect
                x={x - 3}
                y={14}
                width="6"
                height="6"
                transform={`rotate(45 ${x} 17)`}
                fill="#cbad8d"
                stroke="#fdfaf5"
                strokeWidth="0.8"
              />
              <circle cx={x} cy={17} r="1.2" fill="#8f7262" />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
