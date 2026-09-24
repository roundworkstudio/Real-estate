import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WhatsAppFloatingButton } from "@/components/ui/WhatsAppFloatingButton";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
