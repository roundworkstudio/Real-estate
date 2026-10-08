import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type Ref,
} from "react";

type Variant = "primary" | "dark" | "ghost-light" | "light";

const variantClass: Record<Variant, string> = {
  primary: "bg-royal-deep text-white hover:bg-royal-deep/90",
  dark: "bg-slate text-white hover:bg-slate/90",
  // For use over photography or a deep-blue panel.
  "ghost-light": "bg-white/10 text-white hover:bg-white/20",
  // Solid white button, dark text — for use on a deep-blue panel.
  light: "bg-white text-royal-deep hover:bg-white/90",
};

const baseClass =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors";

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: undefined;
};
type ButtonAsAnchor = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
};
type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/**
 * forwardRef kept even though no current caller attaches anything to it —
 * cheap to support, and the shared styled button/link is exactly where a
 * future hover/motion hook (à la the magnetic pull Nav's "Book a call" and
 * WhatsAppFloatingButton had, removed 2026-09-27 at explicit request) would
 * attach again if one gets added back.
 *
 * Renders as an `<a>` when `href` is passed, `<button>` otherwise — added
 * 2026-09-27 when a codebase-wide dead-link/dead-CTA cleanup found every
 * "Book a call"/"View listings"/etc. button site-wide had no destination
 * (plain `<button>`, no onClick). A `<button>` nested in an `<a>` is
 * invalid HTML, so the styled component itself needs to be able to become
 * the link rather than wrapping it.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = "primary", className = "", ...props }, ref) {
    const cls = `${baseClass} ${variantClass[variant]} ${className}`;

    if (props.href !== undefined) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          className={cls}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={cls}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  },
);
