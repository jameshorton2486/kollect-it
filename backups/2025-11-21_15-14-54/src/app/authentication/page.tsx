import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Guarantee",
  description:
    "Our specialists rigorously authenticate every item we sell. Learn what we verify and our guarantee of authenticity for all purchases.",
  openGraph: {
    title: "Authentication Guarantee",
    description:
      "Our specialists rigorously authenticate every item we sell. Learn what we verify and our guarantee of authenticity for all purchases.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Authentication Guarantee",
    description:
      "Our specialists rigorously authenticate every item we sell. Learn what we verify and our guarantee of authenticity for all purchases.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
  },
};

export default function AuthenticationPage() {
  return (
    <>
      {/* Main Content */}
      <main
        className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12"
        role="main"
      >
        <h1 className="ki-heading-xl text-center">Authentication Guarantee</h1>

        <section className="mt-12 space-y-6">
          <h2 className="ki-heading-md">Verified Authenticity</h2>
          <p className="ki-text-base">
            Every item sold through Kollect-It undergoes rigorous authentication
            by our team of specialists.
          </p>
        </section>

        <section className="mt-8 space-y-6">
          <h2 className="ki-heading-md">What We Verify</h2>
          <p className="ki-text-base">
            Our specialists examine provenance, physical condition, maker marks,
            historical documentation, and consistency with similar items in
            known collections. We verify antique status, originality, and
            quality grade.
          </p>
        </section>

        <section className="mt-8 space-y-6">
          <h2 className="ki-heading-md">Our Guarantee</h2>
          <p className="ki-text-base">
            Every item comes with a signed Certificate of Authenticity. If any
            item is later found to be inauthentic, we offer a full refund—no
            questions asked.
          </p>
        </section>

        <section className="mt-12 text-center">
          <Link href="/contact" className="ki-btn-primary inline-block">
            Contact Our Experts
          </Link>
        </section>
      </main>

      {/* Global Footer is rendered by ClientBody */}
    </>
  );
}

