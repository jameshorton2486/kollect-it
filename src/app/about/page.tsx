// src/app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Kollect-It | Curated Antiques & Collectibles",
};

export default function AboutPage() {
  return (
    <main id="main" className="bg-lux-ink-soft text-lux-ink">
      {/* Hero / intro band */}
      <section className="border-b border-lux-silver/30 bg-lux-black py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <p className="text-xs font-semibold tracking-[0.18em] text-lux-gold uppercase">
            About Kollect-It
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-lux-cream sm:text-4xl">
            A considered marketplace for serious collectors.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-lux-silver/85">
            Kollect-It was created for people who care about what an object
            is, where it has been, and where it is going next. We bring
            together vetted antiques, fine art, and significant collections
            with the kind of documentation and presentation usually reserved
            for private galleries.
          </p>
        </div>
      </section>

      {/* Story band */}
      <section className="border-b border-lux-silver/30 bg-lux-pearl/80 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.16em] text-lux-gold uppercase">
              The idea
            </h2>
            <p className="mt-2 text-xl font-semibold text-lux-black">
              Built from the perspective of a collector and a seller.
            </p>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-lux-gray-dark">
            <p>
              Kollect-It grew out of years spent on both sides of the
              transaction—assembling collections, managing estates, and
              navigating auction houses and online marketplaces. We saw how
              often great objects were undersold by rushed descriptions,
              poor photography, or missing provenance.
            </p>
            <p>
              This platform is designed to slow things down just enough:
              better research, better documentation, better presentation—and
              ultimately, better outcomes for both consignors and buyers.
            </p>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="border-b border-lux-silver/30 bg-lux-cream py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="md:flex md:items-start md:justify-between md:gap-10">
            <div className="max-w-md">
              <h2 className="text-sm font-semibold tracking-[0.16em] text-lux-gold uppercase">
                What makes Kollect-It different
              </h2>
              <p className="mt-2 text-xl font-semibold text-lux-black">
                Documentation and presentation are treated as seriously as
                the objects themselves.
              </p>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:mt-0">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-lux-black">
                  Authentication first
                </h3>
                <p className="text-sm leading-relaxed text-lux-gray-dark">
                  We focus on objects with clear attribution, strong
                  provenance, or enough context to make a confident case.
                  When something is uncertain, we say so—and price it
                  accordingly.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-lux-black">
                  Quiet, archival presentation
                </h3>
                <p className="text-sm leading-relaxed text-lux-gray-dark">
                  Photography, layout, and language are chosen to feel more
                  like a thoughtfully printed catalog than a scrolling feed.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-lux-black">
                  Consignor-first structure
                </h3>
                <p className="text-sm leading-relaxed text-lux-gray-dark">
                  We partner with estates, dealers, and private collectors to
                  place pieces where they&apos;ll be understood and
                  appreciated, not just sold quickly.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-lux-black">
                  Transparent communication
                </h3>
                <p className="text-sm leading-relaxed text-lux-gray-dark">
                  You see how we&apos;re describing your pieces, how buyers
                  are responding, and how final prices are reached.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="border-b border-lux-silver/30 bg-lux-ink-soft py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.16em] text-lux-gold uppercase">
              Who we serve
            </h2>
            <p className="mt-2 text-xl font-semibold text-lux-cream">
              Collectors, estates, and those in-between.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-lux-cream">
                Established collectors
              </h3>
              <p className="text-sm leading-relaxed text-lux-silver/85">
                Looking to refine or re-balance a collection while keeping a
                clear record of what has moved, where, and why.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-lux-cream">
                Families &amp; estates
              </h3>
              <p className="text-sm leading-relaxed text-lux-silver/85">
                Navigating a houseful of objects, some obviously important,
                others quietly so. We help you triage, prioritize, and plan.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-lux-cream">
                Dealers &amp; advisors
              </h3>
              <p className="text-sm leading-relaxed text-lux-silver/85">
                Partnering on select consignments where our audience, format,
                and research can add value to your existing channels.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-lux-cream">
                New collectors
              </h3>
              <p className="text-sm leading-relaxed text-lux-silver/85">
                People who are ready to move beyond impulse buys and start
                acquiring with intention, context, and long-term enjoyment in
                mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-lux-black py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-lux-gold uppercase">
              Next step
            </p>
            <h2 className="mt-2 text-xl font-semibold text-lux-cream">
              Have a collection, or thinking about starting one?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-lux-silver/85">
              We&apos;re happy to look at a single piece, an attic, or
              anything in-between. Start with a simple conversation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/sell"
              className="inline-flex items-center rounded-full border border-lux-gold px-5 py-2.5 text-xs font-medium text-lux-cream transition hover:bg-lux-gold hover:text-lux-black"
            >
              Start a consignment conversation
            </Link>
            <Link
              href="/contact"
              className="text-xs font-medium text-lux-silver/80 underline-offset-4 hover:text-lux-cream hover:underline"
            >
              Contact Kollect-It
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


