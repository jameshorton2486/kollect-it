import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Kollect-It",
  description: "Our refund and return policy for authenticated antiques and collectibles.",
  alternates: {
    canonical: "https://kollect-it.com/refund-policy",
  },
  openGraph: {
    title: "Refund Policy | Kollect-It",
    description: "Our refund and return policy for authenticated antiques and collectibles.",
    url: "https://kollect-it.com/refund-policy",
    type: "website",
  },
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-lux-cream">
      {/* Hero Section */}
      <section className="bg-lux-charcoal py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl text-white text-center">
            Refund Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="font-display text-2xl text-gold-500 mt-8 mb-4">
              1. Our Commitment
            </h2>
            <p className="text-gray-700 mb-6">
              At Kollect-It, I stand behind every item I sell. If something isn&apos;t right, 
              I want to make it right. This policy outlines how refunds and returns work.
            </p>

            <h2 className="font-display text-2xl text-gold-500 mt-8 mb-4">
              2. Eligibility for Refunds
            </h2>
            <p className="text-gray-700 mb-4">
              You may request a refund if:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>The item arrives damaged during shipping</li>
              <li>The item is significantly not as described in the listing</li>
              <li>The item fails authentication verification</li>
              <li>You contact me within 48 hours of delivery for any other concerns</li>
            </ul>

            <h2 className="font-display text-2xl text-gold-500 mt-8 mb-4">
              3. Refund Process
            </h2>
            <p className="text-gray-700 mb-4">
              To request a refund:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 mb-6 space-y-2">
              <li>Contact me at james@kollect-it.com within 48 hours of delivery</li>
              <li>Include your order number and photos of any issues</li>
              <li>I&apos;ll respond within 24 hours with next steps</li>
              <li>If approved, return shipping instructions will be provided</li>
            </ol>

            <h2 className="font-display text-2xl text-gold-500 mt-8 mb-4">
              4. Refund Timeline
            </h2>
            <p className="text-gray-700 mb-6">
              Once I receive and inspect the returned item, refunds are processed within 
              5-7 business days. The refund will be credited to your original payment method. 
              Depending on your bank or card issuer, it may take an additional 5-10 business 
              days for the refund to appear on your statement.
            </p>

            <h2 className="font-display text-2xl text-gold-500 mt-8 mb-4">
              5. Return Shipping
            </h2>
            <p className="text-gray-700 mb-6">
              If the return is due to an error on my part (wrong item, damage, or 
              misrepresentation), I will cover return shipping costs. For other returns, 
              the buyer is responsible for return shipping.
            </p>

            <h2 className="font-display text-2xl text-gold-500 mt-8 mb-4">
              6. Non-Refundable Situations
            </h2>
            <p className="text-gray-700 mb-4">
              Refunds are generally not available for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Change of mind after 48 hours</li>
              <li>Items damaged after delivery due to mishandling</li>
              <li>Items not returned in original condition</li>
              <li>Custom or commissioned pieces (unless defective)</li>
            </ul>

            <h2 className="font-display text-2xl text-gold-500 mt-8 mb-4">
              7. Partial Refunds
            </h2>
            <p className="text-gray-700 mb-6">
              In some cases, a partial refund may be offered if an item has minor issues 
              that don&apos;t warrant a full return. This will be discussed on a case-by-case basis.
            </p>

            <h2 className="font-display text-2xl text-gold-500 mt-8 mb-4">
              8. Contact
            </h2>
            <p className="text-gray-700 mb-6">
              Questions about refunds? Reach out to me at{" "}
              <a href="mailto:james@kollect-it.com" className="text-gold-500 hover:underline">
                james@kollect-it.com
              </a>{" "}
              or call 469-386-6065. I handle every situation personally—no automated 
              processes, just a direct conversation about how to make things right.
            </p>

          </div>
        </div>
      </section>
    </main>
  );
}
