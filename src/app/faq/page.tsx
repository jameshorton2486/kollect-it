import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "FAQ | Kollect-It",
  description: "Frequently asked questions about Kollect-It—shipping, returns, authentication, consignment, and more.",
  alternates: {
    canonical: "https://kollect-it.com/faq",
  },
  openGraph: {
    title: "FAQ | Kollect-It",
    description: "Frequently asked questions about shipping, returns, authentication, and consignment.",
    url: "https://kollect-it.com/faq",
    type: "website",
  },
};

const faqs = [
  {
    category: "Buying",
    questions: [
      {
        question: "Do you authenticate items?",
        answer: "Yes—everything I list is researched and presented as accurately as I can. If I'm unsure about something, I'll tell you. I'd rather be honest about uncertainty than make claims I can't back up.",
      },
      {
        question: "Where do your items come from?",
        answer: "Estate sales, private collections, auctions, and consignments. I only select pieces that meet my standards for condition, character, and interest.",
      },
      {
        question: "Can I request additional photos?",
        answer: "Absolutely. Just send me an email and I'll be happy to take more photos or provide additional details about any piece you're interested in.",
      },
    ],
  },
  {
    category: "Shipping",
    questions: [
      {
        question: "How quickly do items ship?",
        answer: "Usually within 1-2 business days. Tracking is always included.",
      },
      {
        question: "How do you pack items?",
        answer: "Very carefully. I pack everything myself using the correct materials for each piece. Fragile or high-value items receive extra care.",
      },
      {
        question: "Do you ship internationally?",
        answer: "Not at this time, but I am working on adding it in the future.",
      },
    ],
  },
  {
    category: "Returns",
    questions: [
      {
        question: "What is your return policy?",
        answer: "If an item arrives damaged or not as described, I will make it right. For all other returns, please contact me within 48 hours of delivery.",
      },
      {
        question: "How do I initiate a return?",
        answer: "Email me at jameshorton2486@gmail.com with your order number and photos of any issues. I'll respond within 24 hours with next steps.",
      },
    ],
  },
  {
    category: "Consignment",
    questions: [
      {
        question: "Do you accept consignments?",
        answer: "Sometimes, yes. If you have something interesting or unusual, reach out and tell me about it. I'll be honest about whether it's a good fit for what I'm building here.",
      },
      {
        question: "What's the commission rate?",
        answer: "Commission depends on the type of item and estimated value, usually a simple flat percentage. I'll explain everything clearly before you decide.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="bg-lux-pearl">
      {/* Header */}
      <PageHeader
        label="Support"
        title="Frequently Asked Questions"
        description="Find answers to common questions about buying, selling, and shipping."
      />

      {/* FAQ Content */}
      <section className="section-normal">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-12">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="heading-section text-lux-gold mb-6">{section.category}</h2>
                <div className="space-y-4">
                  {section.questions.map((faq) => (
                    <details
                      key={faq.question}
                      className="group bg-lux-white rounded-lg border border-lux-silver-soft"
                    >
                      <summary className="flex cursor-pointer items-center justify-between p-6 font-serif text-lg font-medium text-lux-black hover:text-lux-gold transition-colors">
                        {faq.question}
                        <span className="ml-4 flex-shrink-0 text-lux-gold group-open:rotate-180 transition-transform">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6">
                        <p className="text-ink-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-lux-cream section-normal">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="heading-section text-lux-black mb-4">Still Have Questions?</h2>
          <p className="text-ink-700 mb-8 max-w-xl mx-auto">
            Can&apos;t find what you&apos;re looking for? I&apos;m happy to help. Reach out and I&apos;ll get back to you within 24 hours.
          </p>
          <Link href="/contact" className="btn-primary rounded-full">
            Contact Me
          </Link>
        </div>
      </section>
    </main>
  );
}
