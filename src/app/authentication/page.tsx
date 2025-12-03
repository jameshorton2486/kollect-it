import { Metadata } from "next";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "Authentication Guarantee | Kollect-It",
  description:
    "Kollect-It's commitment to authenticity and our authentication process for all items. Every piece is researched and evaluated before being listed.",
  alternates: {
    canonical: "https://kollect-it.com/authentication",
  },
  openGraph: {
    title: "Authentication Guarantee | Kollect-It",
    description: "Our commitment to authenticity and the research process we use to verify every item.",
    url: "https://kollect-it.com/authentication",
    type: "website",
  },
};

export default function AuthenticationPage() {
  return (
    <main>
      <AesopSection variant="cream">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl mb-12 pb-6 border-b-2 border-gold">
            Authentication Guarantee
          </h1>

          <div className="space-y-10">
            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                1. Our Commitment
              </h2>
              <p className="leading-relaxed text-ink-light">
                Every item on Kollect-It has been personally examined and researched. I believe in transparency, and that means standing behind the authenticity of what I list. If an item is described as authentic, it&apos;s because I&apos;ve done the work to verify it.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                2. Authentication Process
              </h2>
              <p className="leading-relaxed text-ink-light mb-4">
                Before any item appears on the site, I review:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed text-ink-light ml-4">
                <li>Maker&apos;s marks, signatures, and hallmarks</li>
                <li>Material composition and construction methods</li>
                <li>Provenance documentation when available</li>
                <li>Comparative examples and reference materials</li>
                <li>Condition indicators that match the item&apos;s age and origin</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                3. Description Standards
              </h2>
              <p className="leading-relaxed text-ink-light">
                I use clear language to describe authenticity:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed text-ink-light ml-4 mt-4">
                <li><strong>Authentic:</strong> I&apos;ve verified this item and stand behind its authenticity</li>
                <li><strong>Attributed to:</strong> While not definitively authenticated, strong evidence suggests this maker or period</li>
                <li><strong>School of / Style of:</strong> The item reflects the style and period but may not be by the named maker</li>
                <li><strong>Period:</strong> The item dates to the stated era, regardless of maker attribution</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                4. Your Protection
              </h2>
              <p className="leading-relaxed text-ink-light">
                If you receive an item that doesn&apos;t match its authentication description, contact me immediately. I will investigate, and if the item is found to be inauthentic or misrepresented, you&apos;ll receive a full refund including return shipping.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                5. Third-Party Verification
              </h2>
              <p className="leading-relaxed text-ink-light">
                For high-value items, I may include appraisal documents or third-party authentication when available. These are noted in the item description, but my authentication guarantee stands independently.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                6. Questions or Concerns
              </h2>
              <p className="leading-relaxed text-ink-light">
                Have questions about an item&apos;s authenticity or want to see additional documentation? I&apos;m here to help. Reach out at james@kollect-it.com, and I&apos;ll provide whatever information I can to give you confidence in your purchase.
              </p>
            </section>
          </div>
        </div>
      </AesopSection>
    </main>
  );
}
