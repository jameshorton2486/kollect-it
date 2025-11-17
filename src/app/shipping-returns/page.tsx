import Link from "next/link";
import type { Metadata } from "next";

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
      <main
        className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12"
        role="main"
      >
        <h1 className="ki-heading-xl text-center">Shipping & Returns</h1>

        <section className="mt-12 space-y-6">
          <h2 className="ki-heading-md">Shipping</h2>
          <p className="ki-text-base">
            Your order will be securely packaged, insured, and shipped with full
            tracking and delivery confirmation. Shipping times vary based on
            item size and destination, but most orders ship within 3–5 business
            days. Professional packaging ensures items arrive in the condition
            described.
          </p>
        </section>

        <section className="mt-8 space-y-6">
          <h2 className="ki-heading-md">Returns & Exchanges</h2>
          <p className="ki-text-base">
            We encourage careful review of all photos and descriptions before
            purchasing. Returns are possible but discouraged. If you're not
            satisfied with your purchase, contact us within 30 days of delivery
            to discuss. Items must be returned in original condition with all
            documentation.
          </p>
        </section>

        <section className="mt-12 text-center">
          <Link href="/contact" className="ki-btn-primary inline-block">
            Contact Support
          </Link>
        </section>
      </main>
      {/* Footer is rendered globally via ClientBody */}
    </>
  );
}

