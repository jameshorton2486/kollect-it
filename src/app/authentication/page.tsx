import { Metadata } from "next";
import Link from "next/link";
import { Search, Shield, FileText } from "lucide-react";
import { PageHeader, InfoCard } from "@/components/ui";

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

const processItems = [
  {
    icon: Search,
    title: "Our Process",
    description:
      "Every item on Kollect-It has been personally examined and researched. I believe in transparency, and that means standing behind the authenticity of what I list.",
    details: [
      "Maker's marks, signatures, and hallmarks",
      "Material composition and construction methods",
      "Provenance documentation when available",
      "Comparative examples and reference materials",
      "Condition indicators that match the item's age and origin",
    ],
  },
  {
    icon: Shield,
    title: "Your Protection",
    description:
      "If you receive an item that doesn't match its authentication description, contact me immediately. I will investigate, and if the item is found to be inauthentic or misrepresented, you'll receive a full refund including return shipping.",
    details: [],
  },
  {
    icon: FileText,
    title: "Third-Party Verification",
    description:
      "For high-value items, I may include appraisal documents or third-party authentication when available. These are noted in the item description, but my authentication guarantee stands independently.",
    details: [],
  },
];

const glossaryTerms = [
  {
    term: "Authentic",
    definition:
      "I've verified this item and stand behind its authenticity. This is the strongest claim I make.",
  },
  {
    term: "Attributed to",
    definition:
      "While not definitively authenticated, strong evidence suggests this maker or period. I'll explain what evidence exists.",
  },
  {
    term: "School of / Style of",
    definition:
      "The item reflects the style and period but may not be by the named maker. It shares characteristics with known works.",
  },
  {
    term: "Period",
    definition:
      "The item dates to the stated era, regardless of maker attribution. The age is confirmed, even if the maker is unknown.",
  },
];

export default function AuthenticationPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <PageHeader
        label="Standards"
        title="Authentication Guarantee"
        description="Our commitment to accuracy and transparency. Every piece is researched and evaluated before being listed."
      />

      {/* Process Section */}
      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto max-w-4xl px-4 space-y-8">
          {processItems.map((item) => (
            <InfoCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              details={item.details.length > 0 ? item.details : undefined}
            />
          ))}
        </div>
      </section>

      {/* Glossary Section */}
      <section className="bg-lux-cream section-normal">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-10">
            <p className="text-label text-lux-gold mb-2">Terminology</p>
            <h2 className="heading-section text-lux-black">Description Standards</h2>
            <p className="lead mt-3 max-w-2xl">
              I use clear language to describe authenticity. Here&apos;s what each term means.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {glossaryTerms.map((item) => (
              <div
                key={item.term}
                className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean"
              >
                <h3 className="heading-subsection text-lux-gold mb-2">{item.term}</h3>
                <p className="text-ink-600 text-sm leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA Section */}
      <section className="bg-lux-charcoal section-normal">
        <div className="container mx-auto text-center px-4">
          <h2 className="heading-section text-lux-gold mb-4">Questions about authenticity?</h2>
          <p className="text-lux-cream/80 mb-8 max-w-xl mx-auto">
            Have questions about an item&apos;s authenticity or want to see additional
            documentation? I&apos;m here to help. Reach out and I&apos;ll provide whatever
            information I can to give you confidence in your purchase.
          </p>
          <Link href="/contact" className="btn-primary rounded-full">
            Contact James
          </Link>
          <p className="mt-6 text-sm text-lux-cream/60">
            Or email directly: james@kollect-it.com
          </p>
        </div>
      </section>
    </main>
  );
}
