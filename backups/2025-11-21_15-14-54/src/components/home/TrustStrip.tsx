import { Shield, Package, Award, Undo2, Zap, Lock } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="py-12 md:py-16 bg-surface-1 border-y border-surface-2">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">
              Professional Authentication
            </h3>
            <p className="text-ink-light text-sm leading-relaxed">
              We authenticate items using professional resources and valuation
              tools. If you believe we've made an error, contact us and we'll
              review and adjust. Honesty is our foundation.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Package className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">
              Insured Shipping
            </h3>
            <p className="text-ink-light text-sm leading-relaxed">
              Professional packing and fully insured delivery to your door.
              Tracking provided on all orders.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Award className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">
              Personally Curated
            </h3>
            <p className="text-ink-light text-sm leading-relaxed">
              Every item photographed from multiple angles with honest, detailed
              descriptions. Questions? We'll send more photos or clarify
              anything.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Undo2 className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">
              Returns Available
            </h3>
            <p className="text-ink-light text-sm leading-relaxed">
              We encourage careful review of all photos and descriptions before
              purchasing. Returns are possible but discouraged. Contact us to
              discuss any concerns.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Zap className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">
              Fast Shipping
            </h3>
            <p className="text-ink-light text-sm leading-relaxed">
              Ships within 3-4 business days. Professional packaging to ensure
              items arrive in condition described.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">
              Secure Checkout
            </h3>
            <p className="text-ink-light text-sm leading-relaxed">
              Your payment information is protected by industry-leading security
              standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

