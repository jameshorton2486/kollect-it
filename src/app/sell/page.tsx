import Link from "next/link";
import type { Metadata } from "next";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "Sell Your Items - Kollect-It",
  description:
    "Sell your collectibles with Kollect-It. Professional valuation, fair pricing, and transparent service. Skip the 25-50% auction house fees.",
  openGraph: {
    title: "Sell Your Items - Kollect-It",
    description:
      "Sell your collectibles with Kollect-It. Professional valuation, fair pricing, and transparent service. Skip the 25-50% auction house fees.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Your Items - Kollect-It",
    description:
      "Sell your collectibles with Kollect-It. Professional valuation, fair pricing, and transparent service. Skip the 25-50% auction house fees.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
  },
};

export default function SellPage() {
  return (
    <main role="main">
      {/* HERO SECTION */}
      <AesopSection variant="charcoal">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[12px] tracking-[0.2em] text-[hsl(var(--gold-500))] uppercase mb-6 font-normal">
            HAVE ITEMS TO SELL?
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink mb-6 leading-tight">
            Sell Your Items
            <br />
            Directly to Collectors
          </h1>
          <p className="text-xl md:text-2xl text-ink-light font-serif mb-8 leading-relaxed">
            Whether you have a single valuable piece or a collection, we're
            interested in working with you. Fair valuations, transparent
            process, no 25-50% auction house commissions.
          </p>
          <a
            href="#consignment-form"
            className="inline-block bg-gold text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Tell Us About Your Items
          </a>
        </div>
      </AesopSection>

      {/* HOW IT WORKS - DETAILED PROCESS */}
      <AesopSection variant="cream">
        <div className="max-w-4xl mx-auto">
          <p className="text-[12px] tracking-[0.2em] text-[hsl(var(--gold-500))] uppercase mb-4 font-normal text-center">
            HOW IT WORKS
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-16 leading-tight text-center">
            Six Simple Steps
          </h2>

          <div className="space-y-8">
            <div className="process-step flex gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white font-serif font-bold text-lg">
                  1
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-serif text-2xl text-ink mb-3">
                  Submit Your Items
                </h3>
                <p className="text-ink-light leading-relaxed text-base md:text-lg">
                  Fill out our simple consignment form with photos and
                  descriptions of your items. Our team reviews submissions
                  within 48 hours and provides initial feedback.
                </p>
              </div>
            </div>

            <div className="process-step flex gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white font-serif font-bold text-lg">
                  2
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-serif text-2xl text-ink mb-3">
                  Expert Evaluation
                </h3>
                <p className="text-ink-light leading-relaxed text-base md:text-lg">
                  Our specialists assess authenticity, condition, and market
                  value. We provide a detailed appraisal and pricing
                  recommendation based on comparable sales and current demand.
                </p>
              </div>
            </div>

            <div className="process-step flex gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white font-serif font-bold text-lg">
                  3
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-serif text-2xl text-ink mb-3">
                  Professional Listing
                </h3>
                <p className="text-ink-light leading-relaxed text-base md:text-lg">
                  We handle everything: professional studio photography,
                  detailed descriptions, authentication documentation,
                  strategic pricing, and category optimization for maximum
                  visibility.
                </p>
              </div>
            </div>

            <div className="process-step flex gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white font-serif font-bold text-lg">
                  4
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-serif text-2xl text-ink mb-3">
                  Marketing & Sales
                </h3>
                <p className="text-ink-light leading-relaxed text-base md:text-lg">
                  Your items are promoted to our established collector base
                  through email campaigns, social media, featured placements,
                  and targeted outreach to relevant collectors and dealers.
                </p>
              </div>
            </div>

            <div className="process-step flex gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white font-serif font-bold text-lg">
                  5
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-serif text-2xl text-ink mb-3">
                  White Glove Fulfillment
                </h3>
                <p className="text-ink-light leading-relaxed text-base md:text-lg">
                  When your item sells, we handle all logistics: payment
                  processing, insurance, professional packaging with archival
                  materials, and shipping coordination with full tracking and
                  protection.
                </p>
              </div>
            </div>

            <div className="process-step flex gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white font-serif font-bold text-lg">
                  6
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-serif text-2xl text-ink mb-3">
                  Get Paid
                </h3>
                <p className="text-ink-light leading-relaxed text-base md:text-lg">
                  Receive your payment within 7 days of confirmed delivery.
                  You get itemized documentation showing sale price, all fees,
                  and your net proceeds. Payment via bank transfer, check, or
                  PayPal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AesopSection>

      {/* COMMISSION STRUCTURE */}
      <AesopSection variant="sand">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-[12px] tracking-[0.2em] text-[hsl(var(--gold-500))] uppercase mb-4 font-normal text-center">
              PRICING
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4 leading-tight text-center">
              Simple, Transparent Pricing
            </h2>
            <p className="text-center text-ink-light text-lg mb-12 max-w-2xl mx-auto">
              No upfront fees. No hidden costs. You only pay when your item
              sells.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="commission-tier bg-surface-0 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <h3 className="font-serif text-2xl text-ink mb-2">
                    Standard Items
                  </h3>
                  <p className="text-ink-light text-sm">$50 - $1,000</p>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gold">
                    30%
                  </span>
                  <span className="text-ink-light text-sm ml-2">
                    Commission
                  </span>
                </div>
                <ul className="space-y-3 text-ink-light text-sm">
                  <li>✓ Professional photography</li>
                  <li>✓ Detailed listing</li>
                  <li>✓ Marketing included</li>
                  <li>✓ Shipping coordination</li>
                  <li>✓ Full insurance</li>
                </ul>
              </div>

              <div className="commission-tier bg-gold text-white p-8 rounded-lg shadow-md">
                <div className="absolute -top-4 left-8 bg-gold px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                <div className="mb-6">
                  <h3 className="font-serif text-2xl mb-2">Premium Items</h3>
                  <p className="text-white opacity-90 text-sm">
                    $1,000 - $5,000
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold">25%</span>
                  <span className="text-white opacity-90 text-sm ml-2">
                    Commission
                  </span>
                </div>
                <ul className="space-y-3 text-white opacity-90 text-sm">
                  <li>✓ Everything in Standard, plus:</li>
                  <li>✓ Authentication docs</li>
                  <li>✓ Featured placement</li>
                  <li>✓ Expedited listing</li>
                  <li>✓ Dedicated support</li>
                </ul>
              </div>

              <div className="commission-tier bg-surface-0 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <h3 className="font-serif text-2xl text-ink mb-2">
                    Luxury Items
                  </h3>
                  <p className="text-ink-light text-sm">$5,000+</p>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gold">
                    20%
                  </span>
                  <span className="text-ink-light text-sm ml-2">
                    Commission
                  </span>
                </div>
                <ul className="space-y-3 text-ink-light text-sm">
                  <li>✓ Everything in Premium, plus:</li>
                  <li>✓ Expert appraisal</li>
                  <li>✓ Provenance research</li>
                  <li>✓ Collector outreach</li>
                  <li>✓ White glove pickup</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AesopSection>

      {/* WHAT WE ACCEPT */}
      <AesopSection variant="olive">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-[12px] tracking-[0.2em] text-[hsl(var(--gold-500))] uppercase mb-4 font-normal text-center">
              REQUIREMENTS
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4 leading-tight text-center">
              What We're Looking For
            </h2>
            <p className="text-center text-ink-light text-lg mb-12 max-w-2xl mx-auto">
              We curate items that tell a story, showcase craftsmanship, and
              appeal to serious collectors.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="category-acceptance bg-surface-1 p-6 rounded-lg">
                <h3 className="font-serif text-xl text-ink mb-3">
                  ✓ Fine Art & Paintings
                </h3>
                <ul className="text-ink-light text-sm space-y-1">
                  <li>• Original paintings & prints</li>
                  <li>• Signed/numbered editions</li>
                  <li>• Listed artists preferred</li>
                  <li>• Documented provenance</li>
                </ul>
              </div>

              <div className="category-acceptance bg-surface-1 p-6 rounded-lg">
                <h3 className="font-serif text-xl text-ink mb-3">
                  ✓ Rare Books & Manuscripts
                </h3>
                <ul className="text-ink-light text-sm space-y-1">
                  <li>• First editions</li>
                  <li>• Signed copies</li>
                  <li>• Limited editions</li>
                  <li>• Good+ condition</li>
                </ul>
              </div>

              <div className="category-acceptance bg-surface-1 p-6 rounded-lg">
                <h3 className="font-serif text-xl text-ink mb-3">
                  ✓ Furniture & Decor
                </h3>
                <ul className="text-ink-light text-sm space-y-1">
                  <li>• 18th-20th century pieces</li>
                  <li>• Designer/maker-signed</li>
                  <li>• Unique materials/forms</li>
                  <li>• Good to excellent condition</li>
                </ul>
              </div>

              <div className="category-acceptance bg-surface-1 p-6 rounded-lg">
                <h3 className="font-serif text-xl text-ink mb-3">
                  ✓ Jewelry & Collectibles
                </h3>
                <ul className="text-ink-light text-sm space-y-1">
                  <li>• Antique & vintage</li>
                  <li>• Precious materials</li>
                  <li>• Estate pieces</li>
                  <li>• Authenticated</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded">
              <h3 className="font-serif text-xl text-ink mb-3">
                ✗ We Don't Accept
              </h3>
              <ul className="grid md:grid-cols-2 gap-3 text-ink-light text-sm">
                <li>• Reproductions or replicas</li>
                <li>• Mass-produced items (post-1980)</li>
                <li>• Poor condition items</li>
                <li>• Incomplete sets</li>
                <li>• Unknown provenance</li>
                <li>• Restricted or prohibited items</li>
              </ul>
            </div>
          </div>
        </div>
      </AesopSection>

      {/* SELLER TESTIMONIALS */}
      <AesopSection variant="cream">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-[12px] tracking-[0.2em] text-[hsl(var(--gold-500))] uppercase mb-4 font-normal text-center">
              SUCCESS STORIES
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-16 leading-tight text-center">
              Seller Testimonials
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="testimonial bg-surface-0 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gold text-white rounded-full flex items-center justify-center font-serif font-bold mr-3">
                    JM
                  </div>
                  <div>
                    <p className="font-semibold text-ink">James Mitchell</p>
                    <p className="text-sm text-ink-light">New York, NY</p>
                  </div>
                </div>
                <p className="text-yellow-400 mb-3">★★★★★</p>
                <p className="text-ink-light leading-relaxed">
                  "I was overwhelmed with my collection after my parents passed.
                  Kollect-It made it simple. They authenticated everything,
                  handled all the sales, and I didn't have to worry about a
                  thing. Very professional."
                </p>
              </div>

              <div className="testimonial bg-surface-0 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gold text-white rounded-full flex items-center justify-center font-serif font-bold mr-3">
                    SA
                  </div>
                  <div>
                    <p className="font-semibold text-ink">Sarah Anderson</p>
                    <p className="text-sm text-ink-light">Boston, MA</p>
                  </div>
                </div>
                <p className="text-yellow-400 mb-3">★★★★★</p>
                <p className="text-ink-light leading-relaxed">
                  "As an established dealer, I'm picky about platforms.
                  Kollect-It's commission structure is fair, their photography
                  is excellent, and they genuinely vet their buyer base. My
                  items sell faster here."
                </p>
              </div>

              <div className="testimonial bg-surface-0 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gold text-white rounded-full flex items-center justify-center font-serif font-bold mr-3">
                    RS
                  </div>
                  <div>
                    <p className="font-semibold text-ink">Richard Sterling</p>
                    <p className="text-sm text-ink-light">Philadelphia, PA</p>
                  </div>
                </div>
                <p className="text-yellow-400 mb-3">★★★★★</p>
                <p className="text-ink-light leading-relaxed">
                  "I sold a museum-quality painting through Kollect-It. Their
                  authentication process was thorough, their pricing suggestions
                  were accurate, and they found serious collectors who
                  appreciated the piece."
                </p>
              </div>
            </div>
          </div>
        </div>
      </AesopSection>

      {/* CONSIGNMENT FORM */}
      <AesopSection variant="sand">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-8 text-center leading-tight">
              Start Your Consignment
            </h2>

            <div className="bg-surface-1 p-8 md:p-12 rounded-lg">
              <form className="space-y-8">
                {/* SELLER INFORMATION */}
                <fieldset className="space-y-4">
                  <legend className="font-serif text-2xl text-ink mb-6">
                    Your Information
                  </legend>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-4 py-3 border border-surface-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 border border-surface-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold"
                      required
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-surface-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-surface-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  />
                </fieldset>

                {/* ITEM DETAILS */}
                <fieldset className="space-y-4">
                  <legend className="font-serif text-2xl text-ink mb-6">
                    Item Details
                  </legend>
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold text-ink mb-2"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full px-4 py-3 border border-surface-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold"
                    >
                      <option>Select Category</option>
                      <option>Fine Art</option>
                      <option>Rare Books</option>
                      <option>Furniture</option>
                      <option>Jewelry</option>
                      <option>Collectibles</option>
                      <option>Militaria</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Item Title/Description"
                    className="w-full px-4 py-3 border border-surface-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold"
                    required
                  />
                  <textarea
                    placeholder="Detailed description (materials, condition, history...)"
                    rows={5}
                    className="w-full px-4 py-3 border border-surface-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Estimated Age/Era"
                      className="w-full px-4 py-3 border border-surface-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold"
                    />
                    <input
                      type="text"
                      placeholder="Dimensions (H x W x D)"
                      className="w-full px-4 py-3 border border-surface-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold"
                    />
                  </div>
                </fieldset>

                {/* TERMS */}
                <fieldset>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" required />
                    <span className="text-sm text-ink-light">
                      I agree to the consignment terms and commission structure.
                      <a
                        href="#"
                        className="text-gold hover:underline ml-1"
                      >
                        View Terms
                      </a>
                    </span>
                  </label>
                </fieldset>

                <button
                  type="submit"
                  className="w-full bg-gold text-white font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Submit for Review
                </button>

                <p className="text-sm text-ink-light text-center">
                  Our team will review your submission and respond within 48
                  hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </AesopSection>

      {/* CTA SECTION */}
      <AesopSection variant="olive">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-ink-light mb-4">Questions about consignment?</p>
            <Link
              href="/contact"
              className="text-gold font-semibold hover:underline"
            >
              Contact our consignment team →
            </Link>
          </div>
        </div>
      </AesopSection>
    </main>
  );
}

