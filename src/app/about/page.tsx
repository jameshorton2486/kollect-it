import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Kollect-It | Curated Antiques & Collectibles",
  description:
    "Kollect-It is a curated marketplace for fine art, antiques, jewelry, militaria, rare books, and unusual collectibles.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero band – dark, elegant intro */}
      <section className="section section-dark">
        <div className="container mx-auto max-w-5xl grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-silver">
              About Kollect-It
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight">
              A curated home for {" "}
              <span className="text-lux-gold">remarkable objects</span>.
            </h1>
            <p className="text-sm md:text-base text-lux-silver-soft max-w-xl">
              Kollect-It brings together fine art, antiques, jewelry, militaria,
              rare books, and unusual collectibles into a single, carefully
              edited marketplace—designed for collectors who value provenance,
              condition, and thoughtful presentation.
            </p>
          </div>

          <div className="rounded-3xl border border-lux-silver/30 bg-gradient-to-br from-lux-charcoal/40 via-surface-900 to-lux-charcoal/90 p-6 md:p-8">
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-silver mb-4">
              What we focus on
            </p>
            <ul className="space-y-3 text-sm text-lux-ink-soft/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-lux-gold" />
                <span>Single-owner collections, estates, and long-held pieces.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-lux-gold" />
                <span>Artwork, decorative objects, and design with a story.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-lux-gold" />
                <span>Verified descriptions, clear photos, and honest condition notes.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Story / mission – light cream */}
      <section className="section section-light">
        <div className="container mx-auto max-w-5xl grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl">
              Built for serious collectors—at every level.
            </h2>
            <p className="text-sm md:text-base leading-relaxed">
              Kollect-It is designed for the collector who might be purchasing a
              first important piece—or adding to a collection built over
              decades. Pricing spans approachable to significant, but the
              standards are consistent: authenticity, clarity, and respect for
              the objects themselves.
            </p>
            <p className="text-sm md:text-base leading-relaxed">
              Every item is photographed with care, described plainly, and
              presented in a way that puts condition and details first—so you
              can make informed decisions from your screen.
            </p>
          </div>

          <div className="space-y-5 text-sm md:text-base">
            <div className="rounded-2xl border border-lux-silver-soft bg-lux-ink-soft/70 p-5">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-lux-charcoal/80 mb-2">
                What makes Kollect-It different
              </p>
              <ul className="space-y-2 text-sm">
                <li>• A single, curated destination for multiple categories.</li>
                <li>• Transparent descriptions and condition notes.</li>
                <li>• Listings sourced from estates, collections, and consignors.</li>
                <li>• Tools to favorite, compare, and revisit pieces over time.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Categories overview – muted neutral */}
      <section className="section section-muted">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-charcoal/70">
                Categories
              </p>
              <h2 className="font-serif text-2xl md:text-3xl">
                A focused range of collecting worlds.
              </h2>
            </div>
            <p className="max-w-xl text-sm md:text-base text-lux-charcoal/80">
              Rather than everything for everyone, Kollect-It concentrates on a
              handful of categories where detail, provenance, and presentation
              truly matter.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Fine Art",
                copy: "Paintings, works on paper, and original art with character.",
              },
              {
                label: "Collectibles",
                copy: "Unusual objects, design pieces, and conversation-starting finds.",
              },
              {
                label: "Militaria",
                copy: "Historically significant uniforms, medals, documents, and more.",
              },
              {
                label: "Rare Books",
                copy: "First editions, illustrated volumes, and finely bound works.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-lux-silver-soft bg-white/60 p-4 shadow-sm"
              >
                <p className="text-xs font-semibold tracking-[0.22em] uppercase text-lux-charcoal/70 mb-2">
                  {item.label}
                </p>
                <p className="text-sm text-lux-charcoal/90">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / process band – dark */}
      <section className="section section-dark">
        <div className="container mx-auto max-w-5xl grid gap-10 md:grid-cols-2 items-start">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl">
              A calmer way to discover and acquire.
            </h2>
            <p className="text-sm md:text-base text-lux-silver-soft">
              Kollect-It is intentionally quieter than a crowded auction feed or
              a generic marketplace. Fewer distractions, fewer duplicates,
              curated selections—and more time to actually look.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="rounded-2xl border border-lux-silver/40 bg-surface-900/60 p-5">
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-silver mb-3">
                Our approach
              </p>
              <ul className="space-y-2 text-lux-ink-soft/90">
                <li>• Clear photography and straightforward descriptions.</li>
                <li>• No rush—items are presented as considered offerings, not noise.</li>
                <li>• Tools to favorite, compare, and revisit before you decide.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
// src/app/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-surface-50 text-ink-900">
      {/* Hero */}
      <section className="border-b border-surface-200 bg-surface-100">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
            About
          </p>
          <h1 className="mt-4 text-3xl font-light leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
            About Kollect-It
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
            A small, collector-run marketplace. I&apos;m a lifelong collector who enjoys finding good pieces, researching their stories, and matching them with new homes. Every item is listed by me, one at a time, with realistic descriptions and photos.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="border-b border-surface-200 bg-surface-50">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <h2 className="text-2xl font-light text-ink-900 sm:text-3xl">
            How Kollect-It Started
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-700">
            Kollect-It grew out of years of collecting books, art, militaria, and unusual objects from estates and auctions. I&apos;m not a large company or a warehouse - just one person who enjoys careful research, fair pricing, and connecting interesting pieces with people who appreciate them.
          </p>
        </div>
      </section>

      {/* How I Work */}
      <section className="border-b border-surface-200 bg-surface-100">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <h2 className="text-2xl font-light text-ink-900 sm:text-3xl">
            How I Work With Each Piece
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-700">
            Every item goes through a simple, consistent process before it ever appears on the site:
          </p>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-ink-700">
            <li>
              <span className="font-semibold text-ink-900">Source carefully</span>{" "}
              - I buy from estates, collections, and trusted local auctions.
            </li>
            <li>
              <span className="font-semibold text-ink-900">Research the details</span>{" "}
              - maker, age, condition, and any history I can reasonably confirm.
            </li>
            <li>
              <span className="font-semibold text-ink-900">Photograph honestly</span>{" "}
              - I try to show both the strengths and the wear, so there are no surprises.
            </li>
            <li>
              <span className="font-semibold text-ink-900">Price with the market in mind</span>{" "}
              - I look at recent sales and condition, not wishful thinking.
            </li>
          </ul>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="border-b border-surface-200 bg-surface-50">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <h2 className="text-2xl font-light text-ink-900 sm:text-3xl">
            What You&apos;ll Mostly See Here
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-700">
            The selection will change over time, but most listings fall into a few main areas:
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-surface-200 bg-surface-100 p-5">
              <h3 className="text-base font-semibold text-ink-900">Rare Books &amp; Manuscripts</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Early printings, illustrated editions, and reference works that are interesting to read, research, or display.
              </p>
            </div>
            <div className="rounded-2xl border border-surface-200 bg-surface-100 p-5">
              <h3 className="text-base font-semibold text-ink-900">Fine Art</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Paintings, prints, and pieces that stand out for their quality, subject matter, or story.
              </p>
            </div>
            <div className="rounded-2xl border border-surface-200 bg-surface-100 p-5">
              <h3 className="text-base font-semibold text-ink-900">Historic Militaria</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Items with clear period character and, where possible, documented background or provenance.
              </p>
            </div>
            <div className="rounded-2xl border border-surface-200 bg-surface-100 p-5">
              <h3 className="text-base font-semibold text-ink-900">Collectibles &amp; Oddities</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Design pieces, unusual finds, and small treasures that do not fit neatly into one category but deserve a closer look.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Expect */}
      <section className="border-b border-surface-200 bg-surface-100">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <h2 className="text-2xl font-light text-ink-900 sm:text-3xl">
            What You Can Expect
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-700">
            Kollect-It is intentionally small. That means you are dealing with one person from start to finish, not a rotating team.
          </p>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-ink-700">
            <li>Straightforward descriptions written by a single seller.</li>
            <li>Clear photos taken in real lighting, not heavily edited.</li>
            <li>Reasonable communication - if you have a question, you hear back from me directly.</li>
            <li>A calm, no-pressure buying experience.</li>
          </ul>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-surface-50">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <h2 className="text-2xl font-light text-ink-900 sm:text-3xl">
            Have a Question or a Piece to Discuss?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700">
            If you are curious about an item, need more photos, or have something you are thinking about selling, feel free to reach out. I am always happy to talk through the details.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-gold-500 px-5 py-2.5 text-sm font-medium tracking-wide text-ink-900 hover:border-gold-600 hover:bg-surface-100"
            >
              Go to Contact Page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


