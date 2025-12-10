import { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Wallet, Landmark, CalendarClock, ShieldCheck } from "lucide-react";
import { PageHeader, InfoCard } from "@/components/ui";

export const metadata: Metadata = {
  title: "Payment Options | Kollect-It",
  description: "Secure payment methods available on Kollect-It. Credit cards, PayPal, bank transfers, and installment plans.",
};

const paymentMethods = [
  {
    icon: CreditCard,
    title: "Credit Cards",
    description: "Pay securely with your credit or debit card.",
    features: [
      "Visa, Mastercard, American Express, Discover",
      "Instant processing",
      "Secure encryption via Stripe",
    ],
  },
  {
    icon: Wallet,
    title: "PayPal",
    description: "Use your PayPal account for quick checkout.",
    features: [
      "Pay with your PayPal balance",
      "Buyer Protection included",
      "Quick, familiar checkout",
    ],
  },
  {
    icon: Landmark,
    title: "Bank Transfer",
    description: "Direct wire transfer for larger purchases.",
    features: [
      "Ideal for high-value items",
      "Secure bank-to-bank processing",
      "Contact us to arrange",
    ],
  },
  {
    icon: CalendarClock,
    title: "Installment Plans",
    description: "Spread payments over time for select items.",
    features: [
      "Buy now, pay later options",
      "Flexible monthly payments",
      "Available on qualifying purchases",
    ],
  },
];

export default function PaymentPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <PageHeader
        label="Secure Checkout"
        title="Payment Options"
        description="Multiple secure payment methods to suit your needs. All transactions are encrypted and protected."
      />

      {/* Payment Methods Grid */}
      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {paymentMethods.map((method) => (
              <InfoCard
                key={method.title}
                icon={method.icon}
                title={method.title}
                description={method.description}
                details={method.features}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Security Section — Dark */}
      <section className="bg-lux-charcoal section-normal">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          {/* Shield Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-lux-gold/10 flex items-center justify-center mb-6">
            <ShieldCheck className="h-10 w-10 text-lux-gold" />
          </div>

          <h2 className="heading-section text-lux-gold mb-4">Your Payment is Secure</h2>
          
          <p className="text-lux-cream/80 mb-6 max-w-xl mx-auto leading-relaxed">
            Your security is my top priority. All transactions are encrypted using 
            industry-standard SSL technology through Stripe. I never store your full 
            credit card details on my servers.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-lux-cream/60 mb-10">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-lux-gold" />
              256-bit SSL Encryption
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-lux-gold" />
              PCI Compliant
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-lux-gold" />
              Secure Checkout
            </span>
          </div>

          <Link href="/browse" className="btn-primary rounded-full">
            Browse Collection
          </Link>
        </div>
      </section>
    </main>
  );
}
