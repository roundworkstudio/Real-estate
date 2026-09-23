import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "ghost-light" | "light";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
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
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
