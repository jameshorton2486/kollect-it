import Link from "next/link";
import type { Metadata } from "next";
import { AesopSection } from "@/components/AesopSection";

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
      <AesopSection variant="charcoal">
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-12">Authentication Guarantee</h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="font-serif text-2xl mb-6 text-gold">Verified Authenticity</h2>
            <p className="leading-relaxed text-ink-light text-lg">
              Every item sold through Kollect-It undergoes rigorous authentication
              by our team of specialists.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-6 text-gold">What We Verify</h2>
            <p className="leading-relaxed text-ink-light text-lg">
              Our specialists examine provenance, physical condition, maker marks,
              historical documentation, and consistency with similar items in
              known collections. We verify antique status, originality, and
              quality grade.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-6 text-gold">Our Guarantee</h2>
            <p className="leading-relaxed text-ink-light text-lg">
              Every item comes with a signed Certificate of Authenticity. If any
              item is later found to be inauthentic, we offer a full refund—no
              questions asked.
            </p>
          </section>

          <div className="text-center">
            <Link href="/contact" className="inline-block bg-gold text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity">
              Contact Our Experts
            </Link>
          </div>
        </div>
      </AesopSection>

      {/* Global Footer is rendered by ClientBody */}
    </>
  );
}

