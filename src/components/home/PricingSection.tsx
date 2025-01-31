import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: 20,
    listings: 30,
    features: ["Basic listing analytics", "Standard support", "Community access"],
  },
  {
    name: "Professional",
    price: 40,
    listings: 70,
    features: ["Advanced analytics", "Priority support", "Featured listings", "Bulk upload tools"],
  },
  {
    name: "Enterprise",
    price: 50,
    listings: 100,
    features: ["Custom analytics", "24/7 support", "Featured listings", "Bulk upload tools", "API access"],
  },
];

export function PricingSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-shop-900 mb-4">
            List Your Items & Grow Your Collection
          </h2>
          <p className="text-lg text-shop-600 max-w-2xl mx-auto">
            Choose the perfect plan for your collection. No hidden fees—just an easy way to share your treasures with the world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-shop-800 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-shop-900 mb-2">
                  ${plan.price}
                  <span className="text-lg text-shop-600">/mo</span>
                </div>
                <p className="text-shop-600">Up to {plan.listings} listings</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-shop-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full bg-shop-accent1 hover:bg-shop-accent1/90">
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}