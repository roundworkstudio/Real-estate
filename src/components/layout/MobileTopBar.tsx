"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

/**
 * Compact mobile wordmark pill; the bottom tab bar remains the page nav.
 * After the page begins scrolling, a home bubble buds from the wordmark's
 * right edge and pulls away. The wrapper stays centred, so the wordmark
 * gently shifts left while the two pills settle around the viewport midpoint
 * as one balanced group.
 */
export function MobileTopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="mobile-top-bar pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center md:hidden">
      <div className="flex items-center">
        <Link
          href="/"
          className="glass-nav pointer-events-auto flex h-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-royal-deep/80 px-4 shadow-card"
        >
          <Image
            src="/brand/logo-mobile-light.svg"
            alt="Property with Janvi"
            width={690}
            height={135}
            preload
            className="h-auto w-[min(44vw,170px)]"
          />
        </Link>

        <Link
          href="/"
          aria-label="Home"
          aria-hidden={!scrolled}
          tabIndex={scrolled ? 0 : -1}
          className={`glass-nav flex h-12 origin-left shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-royal-deep/80 text-white shadow-card transition-[width,margin,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            scrolled
              ? "pointer-events-auto ml-2 w-12 translate-x-0 scale-100 opacity-100"
              : "pointer-events-none ml-0 w-0 -translate-x-6 scale-50 opacity-0"
          }`}
        >
          <Home size={18} strokeWidth={1.8} />
        </Link>
      </div>
    </header>
  );
}
