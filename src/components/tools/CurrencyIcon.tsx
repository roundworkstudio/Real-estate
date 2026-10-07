import { useId } from "react";
import type { CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

function Flag({ code }: { code: CurrencyCode }) {
  switch (code) {
    case "AED":
      return (
        <>
          <rect width="24" height="8" fill="#00732F" />
          <rect y="8" width="24" height="8" fill="#FFFFFF" />
          <rect y="16" width="24" height="8" fill="#000000" />
          <rect width="7" height="24" fill="#FF0000" />
        </>
      );
    case "USD":
      return (
        <>
          <rect width="24" height="24" fill="#FFFFFF" />
          {[0, 2, 4, 6, 8, 10, 12].map((i) => (
            <rect key={i} y={i * (24 / 13)} width="24" height={24 / 13} fill="#B22234" />
          ))}
          <rect width="11" height={(24 / 13) * 7} fill="#3C3B6E" />
        </>
      );
    case "EUR":
      return (
        <>
          <rect width="24" height="24" fill="#003399" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={12 + Math.cos(a) * 6.5}
                cy={12 + Math.sin(a) * 6.5}
                r="1"
                fill="#FFCC00"
              />
            );
          })}
        </>
      );
    case "GBP":
      return (
        <>
          <rect width="24" height="24" fill="#012169" />
          <path d="M0 0L24 24M24 0L0 24" stroke="#FFFFFF" strokeWidth="5" />
          <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.6" />
          <path d="M12 0V24M0 12H24" stroke="#FFFFFF" strokeWidth="7" />
          <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="4" />
        </>
      );
    case "INR":
      return (
        <>
          <rect width="24" height="8" fill="#FF9933" />
          <rect y="8" width="24" height="8" fill="#FFFFFF" />
          <rect y="16" width="24" height="8" fill="#138808" />
          <circle cx="12" cy="12" r="2.6" fill="none" stroke="#000080" strokeWidth="0.9" />
        </>
      );
    case "USDT":
      return (
        <>
          <rect width="24" height="24" fill="#26A17B" />
          <path d="M7 7.5H17V10H13.3V18H10.7V10H7Z" fill="#FFFFFF" />
          <ellipse cx="12" cy="11.6" rx="5.6" ry="1.5" fill="none" stroke="#FFFFFF" strokeWidth="1" />
        </>
      );
    case "BTC":
      return (
        <>
          <rect width="24" height="24" fill="#F7931A" />
          <text
            x="12"
            y="17"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="#FFFFFF"
            fontFamily="system-ui, sans-serif"
          >
            ₿
          </text>
        </>
      );
  }
}

export function CurrencyIcon({
  code,
  size = 18,
  className,
}: {
  code: CurrencyCode;
  size?: number;
  className?: string;
}) {
  const clipId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("shrink-0 rounded-full ring-1 ring-slate/10", className)}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <Flag code={code} />
      </g>
    </svg>
  );
}
