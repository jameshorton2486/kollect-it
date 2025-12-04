import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consign With Kollect-It | Sell Your Collectibles",
  description: "Consign your fine art, rare books, militaria, and collectibles with Kollect-It. We handle authentication, photography, and listing.",
  alternates: {
    canonical: "https://kollect-it.com/consign",
  },
};

export default function ConsignPage() {
  return (
    <div className="min-h-screen bg-surface-50 text-ink-900">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="mb-8 text-4xl font-serif font-bold text-ink-900">
          Consign With Kollect-It
        </h1>

        <p className="mb-10 text-lg leading-relaxed text-ink-800">
          If you have a piece you&apos;re thinking about selling, I may be able to help.
          I&apos;m a one-person shop, so I only take on a small number of consignments,
          but I&apos;m always interested in quality items with character, history, or strong design.
        </p>

        <div className="space-y-10 text-lg leading-relaxed">
          {/* What I'm Looking For */}
          <section>
            <h2 className="mb-3 text-2xl font-serif font-semibold text-ink-900">
              What I&apos;m Looking For
            </h2>
            <p className="text-ink-800">
              I&apos;m most interested in pieces that fit the focus of the site:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-ink-800">
              <li>Fine art (paintings, prints, drawings)</li>
              <li>Rare or interesting books and manuscripts</li>
              <li>Historic militaria and related documents</li>
              <li>Unusual collectibles and design pieces</li>
            </ul>
            <p className="mt-3 text-ink-800">
              If you&apos;re not sure whether something is a fit, you can always ask.
            </p>
          </section>

          {/* How Consignment Works */}
          <section>
            <h2 className="mb-3 text-2xl font-serif font-semibold text-ink-900">
              How Consignment Works
            </h2>
            <ol className="mt-3 list-decimal list-inside space-y-3 text-ink-800">
              <li>
                <span className="font-semibold">You contact me</span> -- Send photos, basic details, and anything you know about the piece.
              </li>
              <li>
                <span className="font-semibold">I review the item</span> -- I&apos;ll look at condition, subject, and likely market interest. If it&apos;s not a good fit, I&apos;ll tell you honestly.
              </li>
              <li>
                <span className="font-semibold">We agree on terms</span> -- We&apos;ll agree on an estimated selling range, commission rate, and how long the item will be listed.
              </li>
              <li>
                <span className="font-semibold">I research, photograph, and list the item</span> -- I handle description writing, photography, and listing.
              </li>
              <li>
                <span className="font-semibold">If the item sells</span> -- After payment clears and any return window has passed, I send you your share.
              </li>
            </ol>
          </section>

          {/* Commission */}
          <section>
            <h2 className="mb-3 text-2xl font-serif font-semibold text-ink-900">
              Typical Commission
            </h2>
            <p className="text-ink-800">
              Commission depends on the type of item and estimated value, but is usually a simple flat percentage. I&apos;ll lay this out clearly before you decide, so there are no surprises.
            </p>
          </section>

          {/* When It's Not a Fit */}
          <section>
            <h2 className="mb-3 text-2xl font-serif font-semibold text-ink-900">
              When Consignment Isn&apos;t a Fit
            </h2>
            <p className="text-ink-800">
              Sometimes consignment isn&apos;t the best option. For example:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-ink-800">
              <li>Very low-value items</li>
              <li>Pieces outside the focus of the site</li>
              <li>Items that may need specialized restoration or certification first</li>
            </ul>
            <p className="mt-3 text-ink-800">
              If that&apos;s the case, I&apos;ll let you know and, if possible, suggest other options you might explore.
            </p>
          </section>

          {/* How to Get Started */}
          <section>
            <h2 className="mb-3 text-2xl font-serif font-semibold text-ink-900">
              How to Get Started
            </h2>
            <p className="text-ink-800">If you have something in mind:</p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-ink-800">
              <li>Take a few clear photos (front, back, and any marks)</li>
              <li>Note any damage or repairs you&apos;re aware of</li>
              <li>Send everything to me through the contact page with a short note about the piece</li>
            </ul>
            <p className="mt-4 text-ink-800">
              I&apos;ll review the details and let you know whether it&apos;s a good match.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-gold-500 px-5 py-2.5 text-sm font-medium tracking-wide text-ink-900 hover:border-gold-600 hover:bg-surface-100"
              >
                Go to Contact Page
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
