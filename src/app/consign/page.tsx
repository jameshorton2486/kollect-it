import Link from "next/link";
import { Metadata } from "next";
import { Camera, FileSearch, Handshake } from "lucide-react";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Consign With Kollect-It | Sell Your Collectibles",
  description: "Consign your fine art, rare books, militaria, and collectibles with Kollect-It. We handle authentication, photography, and listing.",
  alternates: {
    canonical: "https://kollect-it.com/consign",
  },
};

const steps = [
  {
    icon: Camera,
    title: "Send Photos",
    description: "Take a few clear photos and send them with basic details about your piece.",
  },
  {
    icon: FileSearch,
    title: "We Review",
    description: "I'll assess condition, market interest, and let you know if it's a good fit.",
  },
  {
    icon: Handshake,
    title: "We Partner",
    description: "I handle research, photography, listing, and sale. You receive your share.",
  },
];

const faqs = [
  {
    question: "What types of items do you accept?",
    answer: "Fine art (paintings, prints, drawings), rare or interesting books, historic militaria, and unusual collectibles. If you're not sure, just ask.",
  },
  {
    question: "What's the typical commission?",
    answer: "Commission depends on item type and estimated value, usually a simple flat percentage. I'll explain everything clearly before you decide.",
  },
  {
    question: "How long does the process take?",
    answer: "Initial review takes 1-2 days. Listing preparation takes about a week. Sale timeframes vary by item and market.",
  },
  {
    question: "What if my item doesn't sell?",
    answer: "We'll discuss options—adjust pricing, extend the listing period, or return the item to you. No pressure.",
  },
];

export default function ConsignPage() {
  return (
    <main className="bg-lux-pearl">
      {/* Header */}
      <PageHeader
        label="Sell With Us"
        title="Consign Your Collection"
        description="Partner with Kollect-It to find the right buyers for your antiques and collectibles."
        maxWidth="5xl"
      />

      {/* What We're Looking For */}
      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto max-w-4xl">
          <h2 className="heading-section text-lux-black mb-6">What We Accept</h2>
          <p className="text-ink-600 mb-6">
            I&apos;m most interested in pieces that fit the focus of the site:
          </p>
          <ul className="grid sm:grid-cols-2 gap-4">
            {[
              "Fine art (paintings, prints, drawings)",
              "Rare or interesting books and manuscripts",
              "Historic militaria and related documents",
              "Unusual collectibles and design pieces",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-lux-gold mt-2 flex-shrink-0" />
                <span className="text-ink-600">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted mt-6">
            Items should generally be valued at $500 or more. If you&apos;re not sure whether something is a fit, you can always ask.
          </p>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section className="bg-lux-cream section-normal">
        <div className="container mx-auto max-w-4xl">
          <h2 className="heading-section text-lux-black text-center mb-12">
            How Consignment Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-lux-pearl mb-4">
                  <step.icon className="h-8 w-8 text-lux-gold" strokeWidth={1.5} />
                </div>
                <p className="text-label text-lux-gold mb-2">Step {index + 1}</p>
                <h3 className="heading-subsection mb-2">{step.title}</h3>
                <p className="text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-lux-pearl section-tight">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="heading-section text-lux-black mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-ink-600 mb-8 max-w-xl mx-auto">
            Take a few photos, note any damage or repairs, and send everything through the contact page with a short note about the piece.
          </p>
          <Link href="/contact" className="btn-primary rounded-full px-8">
            Start a Consignment
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-lux-cream section-normal">
        <div className="container mx-auto max-w-4xl">
          <h2 className="heading-section text-lux-black text-center mb-12">
            Common Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-lux-white rounded-lg border border-lux-silver-soft p-6"
              >
                <h3 className="heading-subsection text-lg mb-2">{faq.question}</h3>
                <p className="text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When It's Not a Fit */}
      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto max-w-4xl">
          <h2 className="heading-section text-lux-black mb-6">
            When Consignment Isn&apos;t a Fit
          </h2>
          <p className="text-ink-600 mb-6">
            Sometimes consignment isn&apos;t the best option. For example:
          </p>
          <ul className="space-y-3">
            {[
              "Very low-value items (under $500)",
              "Pieces outside the focus of the site",
              "Items that may need specialized restoration or certification first",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-lux-gray mt-2 flex-shrink-0" />
                <span className="text-ink-600">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted mt-6">
            If that&apos;s the case, I&apos;ll let you know and, if possible, suggest other options you might explore.
          </p>
        </div>
      </section>
    </main>
  );
}
