import { Metadata } from "next";
import Link from "next/link";
import { Truck, MapPin, RotateCcw, Globe } from "lucide-react";
import { PageHeader, InfoCard } from "@/components/ui";

export const metadata: Metadata = {
  title: "Shipping & Returns | Kollect-It",
  description:
    "Learn about Kollect-It's shipping policies, return process, and how we ensure your collectibles arrive safely.",
  alternates: {
    canonical: "https://kollect-it.com/shipping-returns",
  },
  openGraph: {
    title: "Shipping & Returns | Kollect-It",
    description: "Information about shipping, returns, and how we pack and ship your collectibles safely.",
    url: "https://kollect-it.com/shipping-returns",
    type: "website",
  },
};

const policies = [
  {
    icon: Truck,
    title: "Shipping",
    description:
      "I pack every item myself—it's important to me that your piece arrives safely. I use the right materials for each object, and fragile items get extra care with proper padding and protection.",
    details: [
      "Orders ship within 1–2 business days",
      "Carrier: USPS or UPS (whichever is safest for the item)",
      "Tracking always included",
      "New boxes, foam, bubble wrap, and corner guards as needed",
    ],
    note: "Need something shipped faster? Just let me know and I'll do my best to accommodate.",
  },
  {
    icon: MapPin,
    title: "Local Pickup",
    description:
      "If you're near San Antonio, pickup may be available for larger items. Please contact me before purchasing to confirm availability and arrange a time.",
    details: [],
    note: null,
  },
  {
    icon: RotateCcw,
    title: "Returns",
    description:
      "I want you to be happy with what you receive. If something isn't right, I'll make it right. I handle every return personally—no automated processes, just a conversation about what went wrong and how to fix it.",
    details: [
      "If an item arrives damaged or not as described, I will make it right",
      "For other returns, please contact me within 48 hours of delivery",
      "Items must be returned in the same condition they arrived",
    ],
    note: null,
  },
  {
    icon: Globe,
    title: "International Shipping",
    description:
      "Not available at this time, but I'm working on making it possible. If you're interested in international shipping for a specific piece, reach out and we can discuss options.",
    details: [],
    note: null,
  },
];

export default function ShippingReturnsPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <PageHeader
        label="Policies"
        title="Shipping & Returns"
        description="Clear, simple, and customer-first policies. Every piece is packed with care and shipped with full tracking."
      />

      {/* Policy Cards */}
      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto max-w-4xl px-4 space-y-8">
          {policies.map((policy) => (
            <InfoCard
              key={policy.title}
              icon={policy.icon}
              title={policy.title}
              description={policy.description}
              details={policy.details.length > 0 ? policy.details : undefined}
              note={policy.note || undefined}
            />
          ))}
        </div>
      </section>

      {/* Dark CTA Section */}
      <section className="bg-lux-charcoal section-normal">
        <div className="container mx-auto text-center px-4">
          <h2 className="heading-section text-lux-gold mb-4">Questions about shipping?</h2>
          <p className="text-lux-cream/80 mb-8 max-w-xl mx-auto">
            I&apos;m happy to answer any questions about how your items will be packed and shipped, 
            or to discuss special requests.
          </p>
          <Link href="/contact" className="btn-primary rounded-full">
            Contact Me
          </Link>
        </div>
      </section>
    </main>
  );
}
