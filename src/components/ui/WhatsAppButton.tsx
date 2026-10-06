import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "green" | "light" | "translucent";
  compact?: boolean;
  className?: string;
};

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12.04 2a9.84 9.84 0 0 0-8.42 14.91L2.05 22l5.2-1.53A9.82 9.82 0 0 0 12.04 21h.01a9.91 9.91 0 0 0 9.9-9.9A9.85 9.85 0 0 0 12.04 2Zm0 17.33a8.22 8.22 0 0 1-4.2-1.15l-.3-.18-3.08.91.82-3-.2-.31a8.26 8.26 0 1 1 7 3.83Zm4.71-5.37c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

export function WhatsAppButton({
  href,
  children,
  variant = "green",
  compact = false,
  className,
}: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "whatsapp-action",
        `whatsapp-action--${variant}`,
        compact && "whatsapp-action--compact",
        className,
      )}
    >
      <span className="pulse-dot h-2 w-2 rounded-full bg-[#25D366]" aria-hidden="true" />
      <span className="whatsapp-action__text">{children}</span>
      <span className="whatsapp-action__icon">
        <WhatsAppLogo className="h-[52%] w-[52%]" />
      </span>
      <span className="whatsapp-action__overlay" aria-hidden="true" />
    </a>
  );
}
