/**
 * Homepage — first rough draft. Follows the section order confirmed in
 * SITEMAP.md. Rough fidelity throughout, per docs/what-worked.md
 * ("breadth before depth") — nothing here should be polished before the
 * rest of the site exists at this same rough level.
 *
 * Real: photography (converted client footage, directives/prepare_media.md),
 * the colour/type system (brand-guidelines.md, provisional).
 * Everything else is filler for layout work — LAYOUT FILLER comments in
 * each component say exactly what's fake and why, and
 * docs/client-inputs-required.md has what's actually needed to replace it.
 */
import { Hero } from "@/components/home/Hero";
import { CredibilityNumbers } from "@/components/home/CredibilityNumbers";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { VideoTour } from "@/components/home/VideoTour";
import { AboutPreview } from "@/components/home/AboutPreview";
import { Services } from "@/components/home/Services";
import { Testimonials } from "@/components/home/Testimonials";
import { RecentlySold } from "@/components/home/RecentlySold";
import { AreasServed } from "@/components/home/AreasServed";
import { ValuationPrompt } from "@/components/home/ValuationPrompt";
import { WhatsAppBanner } from "@/components/tools/WhatsAppBanner";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <CredibilityNumbers />
      <FeaturedListings />
      <VideoTour />
      <AboutPreview />
      <Services />
      <Testimonials />
      <RecentlySold />
      <AreasServed />
      <ValuationPrompt />
      <section className="px-6 py-10 sm:px-10">
        <WhatsAppBanner />
      </section>
      <ContactSection />
      <Footer />
    </main>
  );
}
