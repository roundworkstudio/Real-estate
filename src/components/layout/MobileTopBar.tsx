import Image from "next/image";
import Link from "next/link";

/** Compact mobile wordmark pill; the bottom tab bar remains the page nav. */
export function MobileTopBar() {
  return (
    <header className="glass-nav fixed left-1/2 top-2 z-50 w-fit -translate-x-1/2 rounded-full border border-white/10 bg-royal-deep/80 shadow-card md:hidden">
      <Link href="/" className="flex h-12 items-center justify-center px-4">
        <Image
          src="/brand/logo-mobile-light.svg"
          alt="Property with Janvi"
          width={690}
          height={135}
          priority
          className="h-auto w-[min(44vw,170px)]"
        />
      </Link>
    </header>
  );
}
