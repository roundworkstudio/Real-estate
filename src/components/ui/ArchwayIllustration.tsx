import { cn } from "@/lib/utils";

const VB_W = 400;
const VB_H = 600;
const GROUND = 572;

/** Two-centred pointed arch; `k` is each arc's radius as a share of the span
 * (0.5 = semicircle, 1 = equilateral). */
function arch(left: number, right: number, spring: number, base: number, k = 0.75) {
  const span = right - left;
  const r = k * span;
  const h = Math.sqrt(r * r - (r - span / 2) ** 2);
  const mid = left + span / 2;
  return {
    d: `M${left} ${base}V${spring}A${r} ${r} 0 0 1 ${mid} ${(spring - h).toFixed(1)}A${r} ${r} 0 0 1 ${right} ${spring}V${base}Z`,
    apex: spring - h,
  };
}

const OUTER = arch(20, 380, 300, GROUND);
const INNER = arch(56, 344, 300, GROUND);
const REVEAL = arch(82, 318, 312, GROUND);
const DOOR = arch(104, 296, 326, GROUND);

const STUD_ROWS = [372, 412, 452, 492, 532];
const STUD_COLS = [122, 150, 178, 222, 250, 278];
const PANELS: [number, number, number][] = [
  [366, 80, 118],
  [458, 104, 118],
  [366, 80, 210],
  [458, 104, 210],
];

/** Multiplies a fine fractal-noise texture into whatever it's applied to. */
function TextureFilter({
  id,
  frequency,
  slope,
  intercept,
  seed,
}: {
  id: string;
  frequency: string;
  slope: number;
  intercept: number;
  seed: number;
}) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency={frequency} numOctaves="3" seed={seed} result="noise" />
      <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
      <feComponentTransfer in="mono" result="soft">
        <feFuncR type="linear" slope={slope} intercept={intercept} />
        <feFuncG type="linear" slope={slope} intercept={intercept} />
        <feFuncB type="linear" slope={slope} intercept={intercept} />
        <feFuncA type="linear" slope="0" intercept="1" />
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="soft" mode="multiply" result="textured" />
      <feComposite in="textured" in2="SourceGraphic" operator="in" />
    </filter>
  );
}

/**
 * A single grand Emirati archway, lit from the upper right: carved gypsum
 * band with gold, teal and terracotta inlay, stepped plaster reveals, teak
 * doors with brass studs, warm light through the mashrabiya fanlight and
 * limestone entry steps. Decorative only; fade it with a mask over text.
 */
export function ArchwayIllustration({
  id = "archway",
  className,
}: {
  id?: string;
  className?: string;
}) {
  const ref = (name: string) => `${id}-${name}`;
  const url = (name: string) => `url(#${ref(name)})`;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMaxYMin meet"
      className={cn("pointer-events-none", className)}
    >
      <defs>
        <TextureFilter id={ref("plaster")} frequency="0.9" slope={0.16} intercept={0.88} seed={4} />
        <TextureFilter id={ref("grain")} frequency="0.55 0.012" slope={0.45} intercept={0.68} seed={9} />
        <TextureFilter id={ref("stone")} frequency="0.35" slope={0.14} intercept={0.9} seed={2} />

        <filter id={ref("drop")} x="-20%" y="-10%" width="140%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="7" />
          <feOffset dx="-8" dy="10" result="blur" />
          <feFlood floodColor="#3a2d28" floodOpacity="0.28" />
          <feComposite in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={ref("soft")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>

        {/* Carved gypsum band with coloured inlay */}
        <pattern id={ref("band")} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#efe4d3" />
          <g fill="none" stroke="#b8934f" strokeWidth="1.1" strokeLinejoin="round">
            <rect x="5" y="5" width="10" height="10" />
            <rect x="5" y="5" width="10" height="10" transform="rotate(45 10 10)" />
          </g>
          <g fill="none" stroke="#fdf8ef" strokeWidth="0.6" strokeLinejoin="round" transform="translate(-0.6 -0.6)">
            <rect x="5" y="5" width="10" height="10" />
            <rect x="5" y="5" width="10" height="10" transform="rotate(45 10 10)" />
          </g>
          <circle cx="10" cy="10" r="2.2" fill="#3f7a78" />
          <circle cx="9.4" cy="9.4" r="0.7" fill="#9cc4bf" />
          {[0, 20].flatMap((x) =>
            [0, 20].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#b8694a" />),
          )}
        </pattern>

        <linearGradient id={ref("reveal")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f3eadc" />
          <stop offset="0.6" stopColor="#e3d4bf" />
          <stop offset="1" stopColor="#c4ad91" />
        </linearGradient>
        <linearGradient id={ref("recess")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dcc8ae" />
          <stop offset="1" stopColor="#a88d72" />
        </linearGradient>
        <linearGradient id={ref("wood")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8c5733" />
          <stop offset="0.48" stopColor="#7a4a2b" />
          <stop offset="0.52" stopColor="#6a3f24" />
          <stop offset="1" stopColor="#56331d" />
        </linearGradient>
        <linearGradient id={ref("glow")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f7dca6" />
          <stop offset="0.6" stopColor="#efc27a" />
          <stop offset="1" stopColor="#d99a52" />
        </linearGradient>
        <radialGradient id={ref("brass")} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#f6e2a8" />
          <stop offset="0.45" stopColor="#c9a24f" />
          <stop offset="1" stopColor="#7d5f26" />
        </radialGradient>
        <linearGradient id={ref("archShade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1a10" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2a1a10" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ref("jambShade")} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#2a1a10" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#2a1a10" stopOpacity="0" />
        </linearGradient>

        <pattern id={ref("lattice")} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0H9M0 0V9" stroke="#3d2516" strokeWidth="2.6" />
          <path d="M0 0.9H9M0.9 0V9" stroke="#8c5733" strokeWidth="0.6" />
        </pattern>

        <clipPath id={ref("doorClip")}>
          <path d={DOOR.d} />
        </clipPath>
        <clipPath id={ref("revealClip")}>
          <path d={REVEAL.d} />
        </clipPath>
      </defs>

      {/* Contact shadow on the ground */}
      <ellipse cx="190" cy={GROUND + 28} rx="200" ry="8" fill="#3a2d28" opacity="0.18" filter={url("soft")} />

      {/* Frame + reveals, casting a soft shadow down-left onto the wall */}
      <g filter={url("drop")}>
        <g filter={url("plaster")}>
          <path d={`${OUTER.d}${INNER.d}`} fillRule="evenodd" fill={url("band")} />
          <path d={INNER.d} fill={url("reveal")} />
          <path d={REVEAL.d} fill={url("recess")} />
        </g>
      </g>

      {/* Mouldings: highlight on the lit (upper-right) edge, shade opposite */}
      <path d={OUTER.d} fill="none" stroke="#fffaf1" strokeWidth="3" transform="translate(1.5 -1.5)" />
      <path d={OUTER.d} fill="none" stroke="#9b8068" strokeWidth="1.4" />
      <path d={INNER.d} fill="none" stroke="#b8934f" strokeWidth="2.2" />
      <path d={INNER.d} fill="none" stroke="#6f5648" strokeWidth="0.8" transform="translate(-1 1)" />
      <path d={REVEAL.d} fill="none" stroke="#fffaf1" strokeOpacity="0.85" strokeWidth="1.6" transform="translate(1 -1)" />

      {/* Shadow the arch casts into the recess */}
      <g clipPath={url("revealClip")}>
        <rect x="82" y={REVEAL.apex} width="236" height="120" fill={url("archShade")} />
        <rect x="82" y={REVEAL.apex} width="236" height={GROUND - REVEAL.apex} fill={url("jambShade")} />
      </g>

      {/* Doors */}
      <g clipPath={url("doorClip")}>
        <rect x="104" y={DOOR.apex} width="192" height={350 - DOOR.apex} fill={url("glow")} />
        <rect x="104" y={DOOR.apex} width="192" height={350 - DOOR.apex} fill={url("lattice")} />

        <g filter={url("grain")}>
          <rect x="104" y="348" width="192" height={GROUND - 348} fill={url("wood")} />
        </g>
        <rect x="104" y="348" width="192" height="7" fill="#3d2516" />
        <rect x="104" y="348" width="192" height="1.2" fill="#b07a4c" />

        {PANELS.map(([y, h, x]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="72" height={h} rx="2" fill="#000" opacity="0.08" />
            <path d={`M${x} ${y + h}V${y}H${x + 72}`} fill="none" stroke="#2f1c10" strokeWidth="1.6" />
            <path d={`M${x + 72} ${y}V${y + h}H${x}`} fill="none" stroke="#b07a4c" strokeWidth="1.2" />
            <rect x={x + 8} y={y + 8} width="56" height={h - 16} rx="1.5" fill="none" stroke="#3d2516" strokeOpacity="0.6" strokeWidth="0.8" />
          </g>
        ))}

        <rect x="198.6" y="355" width="2.8" height={GROUND - 355} fill="#f3c97a" opacity="0.85" />
        <rect x="196" y="355" width="8" height={GROUND - 355} fill="#f3c97a" opacity="0.18" filter={url("soft")} />

        {STUD_ROWS.flatMap((y) =>
          STUD_COLS.map((x) => (
            <g key={`${x}-${y}`}>
              <circle cx={x - 0.8} cy={y + 1} r="2.6" fill="#1f120a" opacity="0.45" />
              <circle cx={x} cy={y} r="2.4" fill={url("brass")} />
            </g>
          )),
        )}

        {[190, 210].map((x) => (
          <g key={x}>
            <circle cx={x} cy="466" r="2.2" fill={url("brass")} />
            <circle cx={x} cy="474" r="5" fill="none" stroke="#1f120a" strokeOpacity="0.4" strokeWidth="2" transform="translate(-0.8 1)" />
            <circle cx={x} cy="474" r="5" fill="none" stroke="#d8b464" strokeWidth="1.8" />
          </g>
        ))}

        <rect x="104" y={DOOR.apex} width="192" height={GROUND - DOOR.apex} fill={url("jambShade")} />
      </g>
      <path d={DOOR.d} fill="none" stroke="#3d2516" strokeWidth="2.4" />
      <rect x="104" y={GROUND - 4} width="192" height="4" fill="#f3c97a" opacity="0.5" />

      {/* Keystone rosette */}
      <g transform={`translate(200 ${OUTER.apex + 24})`}>
        <circle r="11" fill="#efe4d3" stroke="#b8934f" strokeWidth="1.6" />
        <rect x="-5.5" y="-5.5" width="11" height="11" fill="none" stroke="#b8934f" strokeWidth="1.1" />
        <rect x="-5.5" y="-5.5" width="11" height="11" fill="none" stroke="#b8934f" strokeWidth="1.1" transform="rotate(45)" />
        <circle r="3" fill="#3f7a78" />
        <circle r="1" cx="-0.8" cy="-0.8" fill="#9cc4bf" />
      </g>

      {/* Limestone entry steps */}
      <g filter={url("stone")}>
        <rect x="40" y={GROUND} width="320" height="12" fill="#e4d8c6" />
        <rect x="20" y={GROUND + 12} width="360" height="14" fill="#d4c4ad" />
      </g>
      <rect x="40" y={GROUND} width="320" height="2" fill="#fbf5ec" />
      <rect x="20" y={GROUND + 12} width="360" height="2" fill="#f1e8db" />
      <rect x="40" y={GROUND + 10} width="320" height="3" fill="#3a2d28" opacity="0.18" />
      <rect x="40" y={GROUND} width="64" height="12" fill="#3a2d28" opacity="0.08" />
    </svg>
  );
}
