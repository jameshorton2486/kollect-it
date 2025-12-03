// src/app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Kollect-It | Curated Antiques & Collectibles",
  description:
    "Learn about Kollect-It's thoughtful approach to curating fine art, rare books, collectibles, and militaria. Discover our commitment to quality, authenticity, and collector-focused presentation.",
  alternates: {
    canonical: "https://kollect-it.com/about",
  },
  openGraph: {
    title: "About Kollect-It",
    description:
      "A thoughtful place to discover and share remarkable objects. Learn about our approach to curating authenticated collectibles.",
    url: "https://kollect-it.com/about",
    type: "website",
  },
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
            A thoughtful place to discover and share remarkable objects.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-lux-silver/85">
            I started Kollect-It because I believe great pieces deserve thoughtful presentation. Whether you&apos;re building a collection or looking for one special piece, you&apos;ll find clear descriptions, honest condition notes, and the kind of care that comes from someone who genuinely loves these objects.
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
              Built from experience on both sides of collecting.
            </p>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-lux-gray-dark">
            <p>
              I&apos;ve spent years building my own collections, helping families navigate estates, and working with auction houses and dealers. Along the way, I noticed how often wonderful pieces were overlooked because of rushed descriptions, poor photography, or missing context.
            </p>
            <p>
              Kollect-It is my way of doing things differently—taking the time to research each piece, photograph it properly, and share what I know about its history and condition. It&apos;s slower, more personal, and I think that makes for better outcomes for everyone involved.
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
                I treat documentation and presentation as seriously as the objects themselves.
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
                Families & estates
              </h3>
              <p className="text-sm leading-relaxed text-lux-silver/85">
                Navigating a houseful of objects, some obviously important,
                others quietly so. We help you triage, prioritize, and plan.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-lux-cream">
                Dealers & advisors
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
              I&apos;m happy to look at a single piece, an attic full of objects, or anything in-between. Let&apos;s start with a conversation.
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


