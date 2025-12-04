import type { Metadata } from "next";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "Our Process | Kollect-It",
  description:
    "Learn how Kollect-It evaluates and lists consignments—a thoughtful approach to presenting remarkable objects.",
  alternates: {
    canonical: "https://kollect-it.com/our-process",
  },
  openGraph: {
    title: "Our Process | Kollect-It",
    description: "Learn how we review, document, and present consigned items with care and attention to detail.",
    url: "https://kollect-it.com/our-process",
    type: "website",
  },
};

export default function OurProcessPage() {
  return (
    <main>
      <AesopSection variant="cream">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl mb-12 pb-6 border-b-2 border-gold">
            Our Process
          </h1>

          <div className="space-y-10">
            <section>
              <p className="leading-relaxed text-gray-800 mb-8">
                Consignments are reviewed individually based on the item, category, and condition. We evaluate each piece, document what we can, and present it clearly so buyers know exactly what they're purchasing.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                Step 1 — Review
              </h2>
              <p className="leading-relaxed text-gray-800">
                We assess each item individually for quality, condition, and market interest. Every piece is evaluated on its own merits—there's no one-size-fits-all approach.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                Step 2 — Document
              </h2>
              <p className="leading-relaxed text-gray-800">
                We record details and history when available, and photograph each piece carefully. Provenance, maker marks, condition notes—whatever information we can gather helps buyers make informed decisions.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                Step 3 — Present
              </h2>
              <p className="leading-relaxed text-gray-800">
                Your item is listed with clear images, honest descriptions, and collector-focused detail. We aim to present each piece as you would see it in person, with all the context and transparency you'd expect from a trusted dealer.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                What You Can Expect
              </h2>
              <p className="leading-relaxed text-gray-800 mb-4">
                Every listing includes:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed text-gray-800 ml-4">
                <li>High-quality photographs from multiple angles</li>
                <li>Honest condition assessments, including any flaws</li>
                <li>Known provenance or history when available</li>
                <li>Research-informed pricing based on comparable sales</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                Questions About Consigning?
              </h2>
              <p className="leading-relaxed text-gray-800">
                If you're thinking about consigning a piece, we're happy to discuss it. Every item is evaluated individually, and we'll be honest about whether it's a good fit for Kollect-It. Reach out at james@kollect-it.com to start the conversation.
              </p>
            </section>
          </div>
        </div>
      </AesopSection>
    </main>
  );
}
