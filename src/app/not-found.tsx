import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-canvas">
      <div className="relative hidden md:block">
        <Nav compactStyle />
      </div>
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-28 sm:px-10">
        <p className="text-sm font-medium tracking-wide text-slate/45 uppercase">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate sm:text-5xl">
          This page isn&apos;t listed.
        </h1>
        <p className="mt-4 max-w-md text-slate/65">
          The link may be out of date, or the home has moved. Current inventory
          is on the listings page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/properties" variant="primary">
            View listings
          </Button>
          <Link
            href="/"
            className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-slate/70 hover:text-slate"
          >
            Back home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
