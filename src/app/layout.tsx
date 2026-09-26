import type { Metadata } from "next";
import { Geist_Mono, Poppins, Lora } from "next/font/google";
import { WhatsAppFloatingButton } from "@/components/ui/WhatsAppFloatingButton";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import "./globals.css";

/** Base sans, sitewide body/heading font — see brand-guidelines.md's
 * typography note. Replaces the Next.js default Geist. Not the licensed
 * "Sequel" display face the client chose (still unconfirmed for web
 * embedding); Poppins is an interim, unrestricted stand-in. */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Accent serif for the mixed-type headline treatment (regular sans +
 * upright serif emphasis on one phrase) — see `.font-accent` in
 * globals.css and its usage in Hero.tsx and other page headlines.
 * Swapped from italic Fraunces to upright Lora at explicit user request,
 * matching a client-supplied reference (Kingly Partners' upright serif
 * headline treatment). */
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600"],
  // "block" not the next/font default "swap" — worked around a repaint bug
  // in the dev preview browser where text painted before the webfont
  // swapped in stayed on the fallback face even after the swap fired
  // (fresh DOM nodes created post-load always painted correctly; only
  // nodes present in the initial SSR/parse were affected).
  display: "block",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Janvi Real Estate",
  description: "Abu Dhabi and Dubai real estate.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${lora.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>
          {children}
          <WhatsAppFloatingButton />
          <MobileTabBar />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
