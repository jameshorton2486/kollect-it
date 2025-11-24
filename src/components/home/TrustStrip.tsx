import { Shield, Package, Lock } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="py-12 md:py-16 bg-surface-1 border-y border-surface-2">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">
              Professional Authentication
            </h3>
            <p className="text-ink-700 text-sm leading-relaxed">
              We authenticate items using professional resources and valuation
              tools.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Package className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">
              Insured Shipping
            </h3>
            <p className="text-ink-700 text-sm leading-relaxed">
              Fully insured delivery to your door with tracking provided.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">
              Secure Checkout
            </h3>
            <p className="text-ink-700 text-sm leading-relaxed">
              Your payment information is protected by industry-leading security
              standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

