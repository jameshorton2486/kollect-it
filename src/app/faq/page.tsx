export default function FAQPage() {
  return (
    <div className="min-h-screen bg-surface-50 text-ink-900">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-serif font-bold mb-12 text-ink-900">
          Frequently Asked Questions
        </h1>

        <div className="space-y-10 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-2">
              Do you authenticate items?
            </h2>
            <p>
              Yes -- everything I list is researched and presented as accurately as I can.
              If I am unsure about a detail, I say so. I never guess or exaggerate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-2">
              Where do your items come from?
            </h2>
            <p>
              Estate sales, private collections, auctions, and consignments. I only select pieces
              that meet my standards for condition, character, and interest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-2">
              Do you accept consignments?
            </h2>
            <p>
              Sometimes. If you have something unique or unusual, feel free to contact me --
              I will let you know honestly if it is a good fit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-2">
              What is your return policy?
            </h2>
            <p>
              If an item arrives damaged or not as described, I will make it right. For all other
              returns, please contact me within 48 hours of delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-2">
              How do you pack items?
            </h2>
            <p>
              Very carefully. I pack everything myself using the correct materials for each
              piece. Fragile or high-value items receive extra care.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-2">
              How quickly do items ship?
            </h2>
            <p>
              Usually within 1-2 business days. Tracking is always included.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-2">
              Do you ship internationally?
            </h2>
            <p>
              Not at this time, but I am working on adding it in the future.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

