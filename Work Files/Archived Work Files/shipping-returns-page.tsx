import { Metadata } from "next";
import Link from "next/link";
import { Truck, MapPin, RotateCcw, Globe } from "lucide-react";

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
      <section className="bg-lux-cream section-normal border-b border-lux-silver-soft">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="text-label text-lux-gold mb-2">Policies</p>
          <h1 className="heading-page text-lux-black">Shipping & Returns</h1>
          <p className="lead mt-4 max-w-2xl">
            Clear, simple, and customer-first policies. Every piece is packed with care and shipped with full tracking.
          </p>
        </div>
      </section>

      {/* Policy Cards */}
      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto max-w-4xl px-4 space-y-8">
          {policies.map((policy) => (
            <div
              key={policy.title}
              className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 md:p-8 shadow-clean"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-lux-cream flex items-center justify-center flex-shrink-0">
                  <policy.icon className="h-6 w-6 text-lux-gold" />
                </div>
                <div className="flex-1">
                  <h2 className="heading-subsection text-lux-black">{policy.title}</h2>
                  <p className="text-ink-600 mt-2 leading-relaxed">{policy.description}</p>

                  {policy.details.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {policy.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-ink-600">
                          <span className="text-lux-gold mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {policy.note && (
                    <p className="mt-4 text-sm text-lux-gray italic">{policy.note}</p>
                  )}
                </div>
              </div>
            </div>
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
