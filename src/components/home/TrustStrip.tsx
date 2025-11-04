import { Shield, Package, Award, Undo2, Zap, Lock } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="py-12 md:py-16 bg-surface-1 border-y border-surface-2">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-8 w-8 text-accent-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">Authentication Guaranteed</h3>
            <p className="text-ink-light text-sm leading-relaxed">
              Expert-vetted items with detailed descriptions, provenance documentation, and certification where applicable.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Package className="h-8 w-8 text-accent-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">Insured Shipping</h3>
            <p className="text-ink-light text-sm leading-relaxed">
              Professional packing and fully insured delivery to your door. Tracking provided on all orders.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Award className="h-8 w-8 text-accent-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">Expert Curated</h3>
            <p className="text-ink-light text-sm leading-relaxed">
              Every piece selected for historical significance, aesthetic merit, and investment potential.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Undo2 className="h-8 w-8 text-accent-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">30-Day Returns</h3>
            <p className="text-ink-light text-sm leading-relaxed">
              Not quite right? Full refunds within 30 days, no questions asked. Your satisfaction is guaranteed.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Zap className="h-8 w-8 text-accent-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">Fast Processing</h3>
            <p className="text-ink-light text-sm leading-relaxed">
              Orders ship within 2 business days. Premium items get white-glove handling and priority service.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-8 w-8 text-accent-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-ink mb-2 text-lg">Secure Checkout</h3>
            <p className="text-ink-light text-sm leading-relaxed">
              Bank-level encryption. Your payment information is protected by industry-leading security standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
