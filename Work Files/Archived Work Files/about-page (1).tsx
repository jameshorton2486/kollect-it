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
    <main className="bg-lux-pearl">
      {/* Hero Story Block */}
      <section className="bg-lux-cream section-grand">
        <div className="container mx-auto">
          <p className="text-label text-lux-gold mb-4">About Kollect-It</p>
          <h1 className="heading-page text-lux-black max-w-4xl">
            A thoughtful place to discover and share remarkable objects.
          </h1>
          <p className="lead mt-6 max-w-2xl">
            I started Kollect-It because I believe great pieces deserve thoughtful presentation. Whether you&apos;re building a collection or looking for one special piece, you&apos;ll find clear descriptions, honest condition notes, and the kind of care that comes from someone who genuinely loves these objects.
          </p>
        </div>
      </section>

      {/* The Story */}
      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            <div>
              <p className="text-label text-lux-gold mb-2">The Idea</p>
              <h2 className="heading-section text-lux-black">
                Built from experience on both sides of collecting.
              </h2>
            </div>
            <div className="space-y-4 text-ink-600">
              <p>
                I&apos;ve spent years building my own collections, helping families navigate estates, and working with auction houses and dealers. Along the way, I noticed how often wonderful pieces were overlooked because of rushed descriptions, poor photography, or missing context.
              </p>
              <p>
                Kollect-It is my way of doing things differently—taking the time to research each piece, photograph it properly, and share what I know about its history and condition. It&apos;s slower, more personal, and I think that makes for better outcomes for everyone involved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-lux-cream section-normal">
        <div className="container mx-auto">
          <div className="max-w-xl mb-12">
            <p className="text-label text-lux-gold mb-2">What Makes Us Different</p>
            <h2 className="heading-section text-lux-black">
              Documentation and presentation, treated as seriously as the objects themselves.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="heading-subsection">Authentication First</h3>
              <p className="text-muted">
                We focus on objects with clear attribution, strong provenance, or enough context to make a confident case. When something is uncertain, we say so—and price it accordingly.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="heading-subsection">Archival Presentation</h3>
              <p className="text-muted">
                Photography, layout, and language are chosen to feel more like a thoughtfully printed catalog than a scrolling feed.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="heading-subsection">Consignor-First Structure</h3>
              <p className="text-muted">
                We partner with estates, dealers, and private collectors to place pieces where they&apos;ll be understood and appreciated, not just sold quickly.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="heading-subsection">Transparent Communication</h3>
              <p className="text-muted">
                You see how we&apos;re describing your pieces, how buyers are responding, and how final prices are reached.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            <div>
              <p className="text-label text-lux-gold mb-2">Who We Serve</p>
              <h2 className="heading-section text-lux-black">
                Collectors, estates, and those in-between.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="heading-subsection">Established Collectors</h3>
                <p className="text-muted">
                  Looking to refine or re-balance a collection while keeping a clear record of what has moved, where, and why.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="heading-subsection">Families & Estates</h3>
                <p className="text-muted">
                  Navigating a houseful of objects, some obviously important, others quietly so. We help you triage, prioritize, and plan.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="heading-subsection">Dealers & Advisors</h3>
                <p className="text-muted">
                  Partnering on select consignments where our audience, format, and research can add value to your existing channels.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="heading-subsection">New Collectors</h3>
                <p className="text-muted">
                  People who are ready to move beyond impulse buys and start acquiring with intention, context, and long-term enjoyment in mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-lux-charcoal section-normal">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <p className="text-label text-lux-gold mb-2">Next Step</p>
              <h2 className="heading-section text-lux-cream">
                Have a collection, or thinking about starting one?
              </h2>
              <p className="text-muted mt-4 max-w-xl">
                I&apos;m happy to look at a single piece, an attic full of objects, or anything in-between. Let&apos;s start with a conversation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/consign" className="btn-primary rounded-full">
                Start a Consignment
              </Link>
              <Link
                href="/contact"
                className="text-label text-lux-cream/80 hover:text-lux-gold-light transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
