import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

const CELL = 4;
const COLS = 16;
const ROWS = 32;
const W = COLS * CELL;
const H = ROWS * CELL;

const COLOURS = {
  ground: "#efe6da",
  stripe: "#8f7262",
  band: "#cbad8d",
  motif: "#a48374",
  light: "#f7f1e8",
  deep: "#6f5648",
};

/** Stepped (woven) diamond of radius `n` cells centred on cell (cx, cy). */
function diamond(cx: number, cy: number, n: number, fill: string, key: string) {
  const rects: ReactElement[] = [];
  for (let i = -n; i <= n; i++) {
    const half = n - Math.abs(i);
    rects.push(
      <rect
        key={`${key}-${i}`}
        x={(cx - half) * CELL}
        y={(cy + i) * CELL}
        width={(half * 2 + 1) * CELL}
        height={CELL}
        fill={fill}
      />,
    );
  }
  return rects;
}

/** Row of stepped "teeth" triangles; `up` points them upward from `baseRow`. */
function teeth(baseRow: number, up: boolean, fill: string, key: string) {
  const rects: ReactElement[] = [];
  for (let t = 0; t < COLS / 8; t++) {
    const cx = t * 8 + 4;
    for (let h = 0; h < 4; h++) {
      const half = 3 - h;
      const row = up ? baseRow - h : baseRow + h;
      rects.push(
        <rect
          key={`${key}-${t}-${h}`}
          x={(cx - half) * CELL}
          y={row * CELL}
          width={(half * 2 + 1) * CELL}
          height={CELL}
          fill={fill}
        />,
      );
    }
  }
  return rects;
}

/**
 * Al Sadu weave — the Bedouin textile of the UAE and wider Gulf — recoloured
 * to the site's cream–espresso ramp. One tile is a full band repeat: stripes,
 * teeth borders, and a chain of stepped diamonds, with a fine warp/weft
 * texture laid over so it reads as woven rather than flat vector.
 */
export function SaduPattern({
  id = "sadu",
  className,
}: {
  id?: string;
  className?: string;
}) {
  const weave = `${id}-weave`;
  return (
    <svg aria-hidden className={cn("pointer-events-none", className)}>
      <defs>
        <pattern id={weave} width="4" height="2" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="#ffffff" opacity="0.18" />
          <rect x="3" width="1" height="2" fill="#3a2d28" opacity="0.05" />
        </pattern>
        <pattern id={id} width={W} height={H} patternUnits="userSpaceOnUse">
          <rect width={W} height={H} fill={COLOURS.ground} />

          <rect y={0} width={W} height={2 * CELL} fill={COLOURS.stripe} />
          {teeth(6, true, COLOURS.motif, "top")}
          <rect y={7 * CELL} width={W} height={CELL} fill={COLOURS.motif} />

          <rect y={8 * CELL} width={W} height={13 * CELL} fill={COLOURS.band} />
          {diamond(8, 14, 6, COLOURS.motif, "d-outer")}
          {diamond(8, 14, 4, COLOURS.light, "d-mid")}
          {diamond(8, 14, 2, COLOURS.deep, "d-inner")}
          {diamond(8, 14, 0, COLOURS.light, "d-core")}
          {diamond(0, 14, 2, COLOURS.light, "s-left")}
          {diamond(16, 14, 2, COLOURS.light, "s-right")}
          {diamond(0, 14, 0, COLOURS.motif, "s-left-core")}
          {diamond(16, 14, 0, COLOURS.motif, "s-right-core")}

          <rect y={21 * CELL} width={W} height={CELL} fill={COLOURS.motif} />
          {teeth(22, false, COLOURS.motif, "bottom")}
          <rect y={27 * CELL} width={W} height={2 * CELL} fill={COLOURS.stripe} />

          {[2, 6, 10, 14].map((c) => (
            <rect
              key={`dot-${c}`}
              x={c * CELL}
              y={30 * CELL}
              width={CELL}
              height={CELL}
              fill={COLOURS.motif}
              opacity="0.7"
            />
          ))}

          <rect width={W} height={H} fill={`url(#${weave})`} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
