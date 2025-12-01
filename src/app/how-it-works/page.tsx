import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Kollect-It",
  description:
    "Learn how Kollect-It works for collectors and consignors—from browsing and buying to consigning pieces from your own collection.",
};

export default function HowItWorksPage() {
  return (
    <main className="flex-1">
      {/* Hero – dark band */}
      <section className="section section-dark">
        <div className="container mx-auto max-w-5xl grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-silver">
              How It Works
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight">
              A calmer way to{" "}
              <span className="text-lux-gold">buy and sell</span> remarkable
              objects.
            </h1>
            <p className="text-sm md:text-base text-lux-silver-soft max-w-xl">
              Kollect-It is designed to feel closer to a well-run gallery or
              trusted dealer than a chaotic marketplace. Clear photos, honest
              descriptions, and a straightforward process—for collectors and
              consignors alike.
            </p>
          </div>

          <div className="rounded-3xl border border-lux-silver/30 bg-gradient-to-br from-lux-charcoal/40 via-surface-900 to-lux-charcoal/90 p-6 md:p-8 space-y-4">
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-silver">
              At a glance
            </p>
            <ol className="space-y-3 text-sm text-lux-ink-soft/90">
              <li>1. Browse curated categories and favorite pieces.</li>
              <li>2. Ask questions or proceed to secure checkout.</li>
              <li>3. For sellers, request to consign items from your collection.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* For Collectors – light band */}
      <section className="section section-light">
        <div className="container mx-auto max-w-5xl space-y-10">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-charcoal/70">
              For Collectors
            </p>
            <h2 className="font-serif text-2xl md:text-3xl">
              Finding the right piece—without the noise.
            </h2>
            <p className="text-sm md:text-base leading-relaxed">
              Instead of thousands of similar listings, Kollect-It focuses on
              a smaller number of carefully chosen pieces. Each item is
              presented with clear photography, condition notes, and practical
              details—so you can focus on what matters.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-lux-silver-soft bg-white/80 p-5">
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-charcoal/70 mb-2">
                1. Browse & refine
              </p>
              <p className="text-sm text-lux-charcoal/90">
                Explore by category—Fine Art, Collectibles, Militaria, Rare
                Books—or simply browse all available pieces and refine by price
                or category.
              </p>
            </div>
            <div className="rounded-2xl border border-lux-silver-soft bg-white/80 p-5">
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-charcoal/70 mb-2">
                2. Favorite & compare
              </p>
              <p className="text-sm text-lux-charcoal/90">
                Use your account to favorite items and compare details, so you
                can revisit pieces and make decisions over time—not in a rush.
              </p>
            </div>
            <div className="rounded-2xl border border-lux-silver-soft bg-white/80 p-5">
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-charcoal/70 mb-2">
                3. Purchase with confidence
              </p>
              <p className="text-sm text-lux-charcoal/90">
                When you&apos;re ready, proceed through secure checkout. Behind
                the scenes, Kollect-It coordinates with the seller to confirm
                details, packing, and shipping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Consignors – muted band */}
      <section className="section section-muted">
        <div className="container mx-auto max-w-5xl space-y-10">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-charcoal/70">
              For Consignors
            </p>
            <h2 className="font-serif text-2xl md:text-3xl">
              A thoughtful home for pieces from your collection.
            </h2>
            <p className="text-sm md:text-base text-lux-charcoal/85 leading-relaxed">
              Whether you&apos;re editing a lifetime collection or selling
              selected pieces from an estate, Kollect-It offers a slower,
              more considered approach. The focus is on presentation, context,
              and matching your items with the right buyers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-lux-silver-soft bg-white/70 p-5">
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-charcoal/70 mb-2">
                1. Share your pieces
              </p>
              <p className="text-sm text-lux-charcoal/90">
                Use the “Consign With Us” page to tell us about your items.
                Include quick snapshots or existing documentation if you have
                it—provenance, appraisals, or receipts.
              </p>
            </div>
            <div className="rounded-2xl border border-lux-silver-soft bg-white/70 p-5">
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-charcoal/70 mb-2">
                2. Review terms together
              </p>
              <p className="text-sm text-lux-charcoal/90">
                We discuss which items are a fit, suggested price ranges, and
                consignment terms before anything is listed—so expectations are
                clear from the beginning.
              </p>
            </div>
            <div className="rounded-2xl border border-lux-silver-soft bg-white/70 p-5">
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-charcoal/70 mb-2">
                3. Listing & sale
              </p>
              <p className="text-sm text-lux-charcoal/90">
                Once agreed, items are photographed, described, and listed on
                Kollect-It. When a piece sells, payment is processed and your
                portion is remitted according to the agreed schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Expectations – dark band */}
      <section className="section section-dark">
        <div className="container mx-auto max-w-5xl grid gap-10 md:grid-cols-2 items-start">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl">
              What you can expect from every listing.
            </h2>
            <p className="text-sm md:text-base text-lux-silver-soft">
              The goal is to make each listing feel like you&apos;re standing
              in front of the piece with a knowledgeable dealer—seeing the
              details clearly and understanding the condition honestly.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="rounded-2xl border border-lux-silver/40 bg-surface-900/60 p-5">
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-lux-silver mb-3">
                Listing standards
              </p>
              <ul className="space-y-2 text-lux-ink-soft/90">
                <li>• Clear, high-quality photographs—front, back, and details.</li>
                <li>• Straightforward condition notes, including flaws or repairs.</li>
                <li>• Known provenance or history included when available.</li>
                <li>• Realistic, research-informed pricing—not guesswork.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
