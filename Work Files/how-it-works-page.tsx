import type { Metadata } from "next";
import Link from "next/link";
import { Search, Heart, ShoppingCart, Upload, FileSignature, Tag, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | Kollect-It",
  description:
    "Learn how Kollect-It works for collectors and consignors—from browsing and buying to consigning pieces from your own collection.",
};

const collectorSteps = [
  {
    step: "01",
    icon: Search,
    title: "Browse & Refine",
    description:
      "Explore by category—Fine Art, Collectibles, Militaria, Rare Books—or simply browse all available pieces and refine by price or condition.",
  },
  {
    step: "02",
    icon: Heart,
    title: "Favorite & Compare",
    description:
      "Use your account to favorite items and compare details, so you can revisit pieces and make decisions over time—not in a rush.",
  },
  {
    step: "03",
    icon: ShoppingCart,
    title: "Purchase with Confidence",
    description:
      "When you're ready, proceed through secure checkout. Behind the scenes, Kollect-It coordinates packing, authentication, and shipping.",
  },
];

const consignorSteps = [
  {
    step: "01",
    icon: Upload,
    title: "Share Your Pieces",
    description:
      "Use the \"Consign With Us\" page to tell us about your items. Include quick snapshots or existing documentation if you have it—provenance, appraisals, or receipts.",
  },
  {
    step: "02",
    icon: FileSignature,
    title: "Review Terms Together",
    description:
      "We discuss which items are a fit, suggested price ranges, and consignment terms before anything is listed—so expectations are clear from the beginning.",
  },
  {
    step: "03",
    icon: Tag,
    title: "Listing & Sale",
    description:
      "Once agreed, items are photographed, described, and listed on Kollect-It. When a piece sells, payment is processed and your portion is remitted according to the agreed schedule.",
  },
];

const listingStandards = [
  "Clear, high-quality photographs—front, back, and details",
  "Straightforward condition notes, including flaws or repairs",
  "Known provenance or history included when available",
  "Realistic, research-informed pricing—not guesswork",
];

export default function HowItWorksPage() {
  return (
    <main className="flex-1">
      {/* Hero Section — Dark */}
      <section className="bg-lux-charcoal section-grand">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-center">
            <div className="space-y-6">
              <p className="text-label text-lux-gold">Our Process</p>
              <h1 className="heading-page text-lux-cream">
                A calmer way to{" "}
                <span className="text-lux-gold">buy and sell</span> remarkable objects.
              </h1>
              <p className="lead text-lux-cream/70">
                Kollect-It is designed to feel closer to a well-run gallery or trusted dealer 
                than a chaotic marketplace. Clear photos, honest descriptions, and a 
                straightforward process—for collectors and consignors alike.
              </p>
            </div>

            {/* At a Glance Card */}
            <div className="rounded-2xl border border-lux-silver-soft/30 bg-lux-charcoal/60 p-6 md:p-8">
              <p className="text-label text-lux-gold mb-4">At a Glance</p>
              <ol className="space-y-3 text-sm text-lux-cream/80">
                <li className="flex gap-3">
                  <span className="text-lux-gold font-semibold">1.</span>
                  Browse curated categories and favorite pieces.
                </li>
                <li className="flex gap-3">
                  <span className="text-lux-gold font-semibold">2.</span>
                  Ask questions or proceed to secure checkout.
                </li>
                <li className="flex gap-3">
                  <span className="text-lux-gold font-semibold">3.</span>
                  For sellers, request to consign items from your collection.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* For Collectors Section */}
      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto max-w-5xl px-4 space-y-10">
          <div className="space-y-3 max-w-3xl">
            <p className="text-label text-lux-gold">For Collectors</p>
            <h2 className="heading-section text-lux-black">
              Finding the right piece—without the noise.
            </h2>
            <p className="lead">
              Instead of thousands of similar listings, Kollect-It focuses on a smaller number 
              of carefully chosen pieces. Each item is presented with clear photography, 
              condition notes, and practical details—so you can focus on what matters.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {collectorSteps.map((step) => (
              <div
                key={step.step}
                className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-lux-cream flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-lux-gold" />
                  </div>
                  <span className="text-label text-lux-gold">Step {step.step}</span>
                </div>
                <h3 className="heading-subsection text-lux-black mb-2">{step.title}</h3>
                <p className="text-ink-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Consignors Section */}
      <section className="bg-lux-cream section-normal">
        <div className="container mx-auto max-w-5xl px-4 space-y-10">
          <div className="space-y-3 max-w-3xl">
            <p className="text-label text-lux-gold">For Consignors</p>
            <h2 className="heading-section text-lux-black">
              A thoughtful home for pieces from your collection.
            </h2>
            <p className="lead">
              Whether you&apos;re editing a lifetime collection or selling selected pieces 
              from an estate, Kollect-It offers a slower, more considered approach. The focus 
              is on presentation, context, and matching your items with the right buyers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {consignorSteps.map((step) => (
              <div
                key={step.step}
                className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-lux-pearl flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-lux-gold" />
                  </div>
                  <span className="text-label text-lux-gold">Step {step.step}</span>
                </div>
                <h3 className="heading-subsection text-lux-black mb-2">{step.title}</h3>
                <p className="text-ink-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section — Dark */}
      <section className="bg-lux-charcoal section-normal">
        <div className="container mx-auto max-w-5xl px-4 grid gap-10 md:grid-cols-2 items-start">
          <div className="space-y-4">
            <h2 className="heading-section text-lux-gold">
              What you can expect from every listing.
            </h2>
            <p className="lead text-lux-cream/70">
              The goal is to make each listing feel like you&apos;re standing in front of the 
              piece with a knowledgeable dealer—seeing the details clearly and understanding 
              the condition honestly.
            </p>
          </div>

          <div className="rounded-2xl border border-lux-silver-soft/30 bg-lux-charcoal/60 p-6">
            <p className="text-label text-lux-gold mb-4">Listing Standards</p>
            <ul className="space-y-3">
              {listingStandards.map((standard, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-lux-cream/80">
                  <CheckCircle className="h-4 w-4 text-lux-gold flex-shrink-0 mt-0.5" />
                  <span>{standard}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-lux-cream section-normal">
        <div className="container mx-auto text-center px-4">
          <h2 className="heading-section text-lux-black mb-4">Ready to explore?</h2>
          <p className="lead max-w-xl mx-auto mb-8">
            Whether you&apos;re looking for your next piece or considering consigning 
            something from your collection, I&apos;m here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse" className="btn-primary rounded-full">
              Browse Collection
            </Link>
            <Link href="/consign" className="btn-secondary rounded-full">
              Consign With Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
