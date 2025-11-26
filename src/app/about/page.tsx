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


