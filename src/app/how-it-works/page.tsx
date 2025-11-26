export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-surface-50 text-ink-900">
      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* Page Title */}
        <h1 className="text-4xl font-serif font-bold mb-10 text-ink-900">
          How It Works
        </h1>

        {/* Step-by-step sections */}
        <div className="space-y-12 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              Step 1 — Finding the Piece
            </h2>
            <p>
              I look for quality items at estate sales, auctions, and private
              collections. If something stands out because of condition, age, or
              character, I bring it home.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              Step 2 — Research & Verification
            </h2>
            <p>
              I look into maker, history, materials, date range, and any
              background I can reasonably verify. If I don&apos;t know something,
              I say so — no guessing and no overstatements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              Step 3 — Photography
            </h2>
            <p>
              Items are photographed in natural lighting so you can see the
              real color, texture, and any wear.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              Step 4 — Listing & Pricing
            </h2>
            <p>
              Descriptions are written by me, in plain language. Prices are
              based on condition and recent market sales — not inflated
              “retail” values.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              Step 5 — Packing & Shipping
            </h2>
            <p>
              I pack everything myself using the right materials for each item.
              All items ship with tracking, and fragile pieces receive extra care.
            </p>
          </section>

          <section className="border-t border-surface-300 pt-10">
            <h2 className="text-2xl font-serif font-semibold mb-3">
              Interested in Selling Something?
            </h2>
            <p>
              I occasionally take consignments. If you have something
              interesting, feel free to contact me — I&apos;ll give you an honest
              answer about whether it&apos;s a good fit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
