import type { Metadata } from "next";
import Link from "next/link";
import { Search, Camera, Tag, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/ui";

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

const steps = [
  {
    number: "01",
    title: "Review",
    icon: Search,
    description:
      "We assess each item individually for quality, condition, and market interest. Every piece is evaluated on its own merits—there's no one-size-fits-all approach.",
  },
  {
    number: "02",
    title: "Document",
    icon: Camera,
    description:
      "We record details and history when available, and photograph each piece carefully. Provenance, maker marks, condition notes—whatever information we can gather helps buyers make informed decisions.",
  },
  {
    number: "03",
    title: "Present",
    icon: Tag,
    description:
      "Your item is listed with clear images, honest descriptions, and collector-focused detail. We aim to present each piece as you would see it in person, with all the context and transparency you'd expect from a trusted dealer.",
  },
];

const expectations = [
  "High-quality photographs from multiple angles",
  "Honest condition assessments, including any flaws",
  "Known provenance or history when available",
  "Research-informed pricing based on comparable sales",
];

export default function OurProcessPage() {
  return (
    <main className="bg-lux-pearl">
      {/* Header */}
      <PageHeader
        label="How We Work"
        title="Our Process"
        description="From discovery to delivery, here's how we ensure every transaction is smooth and secure."
      />

      {/* Process Steps */}
      <section className="section-normal">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
             {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-6 bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-lux-cream flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-lux-gold" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-label text-lux-gold">{step.number}</span>
                    <h2 className="heading-subsection text-lux-black">{step.title}</h2>
                  </div>
                  <p className="text-ink-700 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Expect */}
      <section className="bg-lux-cream section-normal">
        <div className="container mx-auto max-w-4xl">
          <h2 className="heading-section text-lux-gold mb-6">What You Can Expect</h2>
          <p className="text-ink-700 mb-8">Every listing includes:</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {expectations.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-lux-white rounded-lg p-4 border border-lux-silver-soft"
              >
                <CheckCircle className="h-5 w-5 text-lux-gold flex-shrink-0 mt-0.5" />
                <p className="text-lux-black">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-lux-charcoal section-normal">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="heading-section text-lux-gold mb-4">Questions About Consigning?</h2>
          <p className="text-lux-cream/80 mb-8 max-w-xl mx-auto">
            If you&apos;re thinking about consigning a piece, we&apos;re happy to discuss it. Every item is evaluated individually, and we&apos;ll be honest about whether it&apos;s a good fit for Kollect-It.
          </p>
          <Link href="/contact" className="btn-primary rounded-full">
            Start a Conversation
          </Link>
        </div>
      </section>
    </main>
  );
}
