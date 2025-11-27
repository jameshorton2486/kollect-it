import Link from "next/link";

export const metadata = {
  title: "About | Kollect-It",
  description:
    "Learn about Kollect-It, a collector-run marketplace for antiques, art, books, and militaria.",
};

export default function AboutPage() {
  return (
    <main className="bg-lux-cream text-lux-black">
      {/* Hero */}
      <section className="border-b border-lux-silver bg-lux-pearl">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.20em] text-lux-gold">
            About
          </p>
          <h1 className="mt-3 font-serif text-3xl font-light leading-tight text-lux-black sm:text-4xl lg:text-5xl">
            About Kollect-It
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-lux-gray-dark sm:text-lg">
            A small, collector-run marketplace. I&apos;m a lifelong collector who enjoys finding good pieces, researching their stories, and matching them with new homes. Every item is listed by me, one at a time, with realistic descriptions and photos.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="border-b border-lux-silver bg-lux-cream">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <h2 className="font-serif text-2xl font-light text-lux-black sm:text-3xl">
            How Kollect-It Started
          </h2>
          <p className="mt-4 text-base leading-relaxed text-lux-gray-dark">
            Kollect-It grew out of years of collecting books, art, militaria, and unusual objects from estates and auctions. I&apos;m not a large company or a warehouse—just one person who enjoys careful research, fair pricing, and connecting interesting pieces with people who appreciate them.
          </p>
        </div>
      </section>

      {/* How I Work */}
      <section className="border-b border-lux-silver bg-lux-pearl">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <h2 className="font-serif text-2xl font-light text-lux-black sm:text-3xl">
            How I Work With Each Piece
          </h2>
          <p className="mt-4 text-base leading-relaxed text-lux-gray-dark">
            Every item goes through a simple, consistent process before it ever appears on the site:
          </p>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-lux-gray-dark">
            <li>
              <span className="font-semibold text-lux-black">Source carefully</span> — I buy from estates, collections, and trusted local auctions.
            </li>
            <li>
              <span className="font-semibold text-lux-black">Research the details</span> — maker, age, condition, and any history I can reasonably confirm.
            </li>
            <li>
              <span className="font-semibold text-lux-black">Photograph honestly</span> — I try to show both the strengths and the wear, so there are no surprises.
            </li>
            <li>
              <span className="font-semibold text-lux-black">Price with the market in mind</span> — I look at recent sales and condition, not wishful thinking.
            </li>
          </ul>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="border-b border-lux-silver bg-lux-cream">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <h2 className="font-serif text-2xl font-light text-lux-black sm:text-3xl">
            What You&apos;ll Mostly See Here
          </h2>
          <p className="mt-4 text-base leading-relaxed text-lux-gray-dark">
            The selection will change over time, but most listings fall into a few main areas:
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-lux-silver/40 bg-lux-pearl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h3 className="text-base font-semibold text-lux-black">Rare Books &amp; Manuscripts</h3>
              <p className="mt-2 text-sm leading-relaxed text-lux-gray-dark">
                Early printings, illustrated editions, and reference works that are interesting to read, research, or display.
              </p>
            </div>
            <div className="rounded-xl border border-lux-silver/40 bg-lux-pearl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h3 className="text-base font-semibold text-lux-black">Fine Art</h3>
              <p className="mt-2 text-sm leading-relaxed text-lux-gray-dark">
                Paintings, prints, and pieces that stand out for their quality, subject matter, or story.
              </p>
            </div>
            <div className="rounded-xl border border-lux-silver/40 bg-lux-pearl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h3 className="text-base font-semibold text-lux-black">Historic Militaria</h3>
              <p className="mt-2 text-sm leading-relaxed text-lux-gray-dark">
                Items with clear period character and, where possible, documented background or provenance.
              </p>
            </div>
            <div className="rounded-xl border border-lux-silver/40 bg-lux-pearl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h3 className="text-base font-semibold text-lux-black">Collectibles &amp; Oddities</h3>
              <p className="mt-2 text-sm leading-relaxed text-lux-gray-dark">
                Design pieces, unusual finds, and small treasures that do not fit neatly into one category but deserve a closer look.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Expect */}
      <section className="border-b border-lux-silver bg-lux-pearl">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <h2 className="font-serif text-2xl font-light text-lux-black sm:text-3xl">
            What You Can Expect
          </h2>
          <p className="mt-4 text-base leading-relaxed text-lux-gray-dark">
            Kollect-It is intentionally small. That means you are dealing with one person from start to finish, not a rotating team.
          </p>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-lux-gray-dark">
            <li>Straightforward descriptions written by a single seller.</li>
            <li>Clear photos taken in real lighting, not heavily edited.</li>
            <li>Reasonable communication—if you have a question, you hear back from me directly.</li>
            <li>A calm, no-pressure buying experience.</li>
          </ul>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-lux-cream">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <h2 className="font-serif text-2xl font-light text-lux-black sm:text-3xl">
            Have a Question or a Piece to Discuss?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-lux-gray-dark">
            If you are curious about an item, need more photos, or have something you are thinking about selling, feel free to reach out. I am always happy to talk through the details.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-lux-black bg-lux-black px-5 py-2 text-sm font-medium text-lux-white transition hover:border-lux-gold hover:bg-lux-gold hover:text-lux-black"
            >
              Go to Contact Page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
