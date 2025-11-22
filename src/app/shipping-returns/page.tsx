import Link from "next/link";
import type { Metadata } from "next";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Secure packaging, insured shipping with tracking, and hassle-free 30-day returns on all purchases from Kollect-It.",
  openGraph: {
    title: "Shipping & Returns",
    description:
      "Secure packaging, insured shipping with tracking, and hassle-free 30-day returns on all purchases from Kollect-It.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping & Returns",
    description:
      "Secure packaging, insured shipping with tracking, and hassle-free 30-day returns on all purchases from Kollect-It.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
  },
};

export default function ShippingReturnsPage() {
  return (
    <>
      <AesopSection variant="olive">
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-12">Shipping & Returns</h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="font-serif text-2xl mb-6 text-gold">Shipping</h2>
            <p className="leading-relaxed text-ink-light text-lg">
              Your order will be securely packaged, insured, and shipped with full
              tracking and delivery confirmation. Shipping times vary based on
              item size and destination, but most orders ship within 3–5 business
              days. Professional packaging ensures items arrive in the condition
              described.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-6 text-gold">Returns & Exchanges</h2>
            <p className="leading-relaxed text-ink-light text-lg">
              We encourage careful review of all photos and descriptions before
              purchasing. Returns are possible but discouraged. If you're not
              satisfied with your purchase, contact us within 30 days of delivery
              to discuss. Items must be returned in original condition with all
              documentation.
            </p>
          </section>

          <div className="text-center">
            <Link href="/contact" className="inline-block bg-gold text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity">
              Contact Support
            </Link>
          </div>
        </div>
      </AesopSection>
      {/* Footer is rendered globally via ClientBody */}
    </>
  );
}

