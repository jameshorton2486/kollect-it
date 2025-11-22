import { Metadata } from "next";
import Link from "next/link";
import { Search, CreditCard, ShieldCheck, Truck, PackageCheck, CheckCircle2 } from "lucide-react";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "How It Works | Kollect-It",
  description: "Learn how to buy and sell authenticated luxury collectibles on Kollect-It.",
};

export default function HowItWorksPage() {
  return (
    <main>
      {/* Hero Section */}
      <AesopSection
        variant="charcoal"
        layout="full"
        title="How It Works"
        description="The premier marketplace for authenticated luxury collectibles and antiques."
      />

      {/* Buying Process */}
      <AesopSection
        variant="cream"
        layout="full"
        title="Buying Process"
      >
        <div className="space-y-8">
          {[
            { step: 1, title: "Browse & Discover", desc: "Explore our curated collection of authenticated items.", icon: Search },
            { step: 2, title: "Place Order", desc: "Securely purchase your desired item using our protected payment system.", icon: CreditCard },
            { step: 3, title: "Authentication", desc: "Every item is verified by our experts before shipping.", icon: ShieldCheck },
            { step: 4, title: "Secure Shipping", desc: "Items are carefully packaged and shipped with insurance.", icon: Truck },
            { step: 5, title: "Delivery", desc: "Receive your item with our satisfaction guarantee.", icon: PackageCheck }
          ].map((item) => (
            <div key={item.step} className="flex items-start bg-surface-0 p-8 rounded-lg border border-border-300">
              <div className="bg-gold-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mr-6 flex-shrink-0">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                <p className="text-ink-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </AesopSection>

      {/* Benefits Grid */}
      <AesopSection variant="sand" layout="full">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Buyer Benefits */}
          <div>
            <h2 className="font-serif text-2xl mb-8 text-gold-600">For Buyers</h2>
            <ul className="space-y-4">
              {[
                "Authenticity Guarantee",
                "Secure Payment Protection",
                "Insured Global Shipping",
                "Expert Curation",
                "Detailed Condition Reports",
                "30-Day Returns"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle2 size={20} color="#C9A66B" className="mr-3" /> {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Seller Benefits */}
          <div>
            <h2 className="font-serif text-2xl mb-8 text-gold-600">For Sellers</h2>
            <ul className="space-y-4">
              {[
                "Access to Global Collectors",
                "Competitive Commission Rates",
                "Professional Photography",
                "Marketing Support",
                "Secure Payment Processing",
                "Shipping Handling"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle2 size={20} color="#C9A66B" className="mr-3" /> {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AesopSection>

      {/* CTA */}
      <AesopSection
        variant="olive"
        layout="full"
        title="Ready to Get Started?"
        description="Join our community of collectors and sellers today."
      >
        <Link
          href="/sell"
          className="inline-block bg-gold-500 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-gold-600 transition-colors"
        >
          Start Selling Today
        </Link>
      </AesopSection>
    </main>
  );
}
