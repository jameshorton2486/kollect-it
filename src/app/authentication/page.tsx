export default function AuthenticationPage() {
  return (
    <div className="min-h-screen bg-surface-50 text-ink-900">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="mb-8 text-4xl font-serif font-bold text-ink-900">
          Authentication &amp; How I Describe Items
        </h1>

        <p className="mb-10 text-lg leading-relaxed text-ink-800">
          I do my best to describe every item as accurately and clearly as I can.
          I research each piece, compare similar examples, and note what I know
          and what I don&apos;t. This page explains what that means in plain language.
        </p>

        <div className="space-y-10 text-lg leading-relaxed">
          {/* What I Do */}
          <section>
            <h2 className="mb-3 text-2xl font-serif font-semibold text-ink-900">
              What I Do
            </h2>
            <ul className="mt-2 list-disc list-inside space-y-2 text-ink-800">
              <li>
                <span className="font-semibold">Research each piece</span> -- maker,
                period, style, and likely use.
              </li>
              <li>
                <span className="font-semibold">Compare with known examples</span> --
                books, trusted auction records, and reference material when
                available.
              </li>
              <li>
                <span className="font-semibold">Check marks and details</span> --
                signatures, hallmarks, labels, and construction.
              </li>
              <li>
                <span className="font-semibold">Describe condition honestly</span> --
                including wear, repairs, and flaws I can see.
              </li>
              <li>
                <span className="font-semibold">Use careful language</span> -- I avoid
                making claims I cannot reasonably support.
              </li>
            </ul>
          </section>

          {/* What I Don't Do */}
          <section>
            <h2 className="mb-3 text-2xl font-serif font-semibold text-ink-900">
              What I Don&apos;t Do
            </h2>
            <p className="text-ink-800">
              I&apos;m a collector and seller, not a laboratory or grading service.
              That means:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-2 text-ink-800">
              <li>I do not perform lab testing on metals, gemstones, or materials.</li>
              <li>I do not offer formal grading or restoration services.</li>
              <li>I do not guarantee investment value or future resale prices.</li>
            </ul>
            <p className="mt-3 text-ink-800">
              If an item has been professionally authenticated or graded by a
              third party, I will say who did the work when that information is
              available.
            </p>
          </section>

          {/* Signatures & Attributions */}
          <section>
            <h2 className="mb-3 text-2xl font-serif font-semibold text-ink-900">
              Signatures, Autographs &amp; Attributions
            </h2>
            <p className="text-ink-800">
              For signed or attributed items, I try to be especially clear:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-2 text-ink-800">
              <li>
                If there is <span className="font-semibold">third-party authentication</span>,
                I will state that in the description.
              </li>
              <li>
                If there is <span className="font-semibold">no third-party opinion</span>, I
                describe the signature and context as clearly as I can and base my
                opinion on comparison and experience.
              </li>
              <li>
                When something is uncertain, I use phrases like <em>"in the style of"</em>,
                <em>"appears to be"</em>, or <em>"attributed to"</em> instead of stating it
                as a fact.
              </li>
            </ul>
          </section>

          {/* Vintage & Antique Items */}
          <section>
            <h2 className="mb-3 text-2xl font-serif font-semibold text-ink-900">
              Vintage &amp; Antique Items
            </h2>
            <p className="text-ink-800">
              Most pieces on Kollect-It are vintage or antique, which means:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-2 text-ink-800">
              <li>Normal age, wear, and patina should be expected.</li>
              <li>
                I try to photograph and describe noticeable issues, but small flaws may
                still be present.
              </li>
              <li>
                Items are sold as described, based on the information reasonably available
                at the time of listing.
              </li>
            </ul>
          </section>

          {/* If I Get Something Wrong */}
          <section>
            <h2 className="mb-3 text-2xl font-serif font-semibold text-ink-900">
              If I Get Something Wrong
            </h2>
            <p className="text-ink-800">
              If you believe a listing is materially inaccurate, please contact me.
              I will review your information and any supporting documentation. If I&apos;ve
              made a meaningful error in description, I will work with you to make it
              right.
            </p>
            <p className="mt-3 text-ink-800">My goal is long-term trust, not one-time sales.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

