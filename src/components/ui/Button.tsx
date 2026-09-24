import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "ghost-light" | "light";
};

/** forwardRef so a magnetic-hover hook (lib/motion.ts's useMagnetic) can
 * attach directly to the underlying <button> — added for the primary CTAs
 * that use it, a no-op for every other caller. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className = "", ...props },
  ref,
) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-royal text-white hover:bg-royal/90",
    dark: "bg-slate text-white hover:bg-slate/90",
    // For use over photography or a deep-blue panel.
    "ghost-light": "bg-white/10 text-white hover:bg-white/20",
    // Solid white button, dark text — for use on a deep-blue panel.
    light: "bg-white text-royal-deep hover:bg-white/90",
  };

  return (
    <button
      ref={ref}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
});
