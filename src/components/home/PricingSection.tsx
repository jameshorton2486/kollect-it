import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: 20,
    listings: 30,
    features: [
      "30 monthly listings",
      "Basic analytics",
      "Standard support",
      "Community access",
      "No commission fees",
    ],
  },
  {
    name: "Professional",
    price: 30,
    listings: 50,
    features: [
      "50 monthly listings",
      "Advanced analytics",
      "Priority support",
      "Featured listings",
      "Bulk upload tools",
      "No commission fees",
    ],
  },
  {
    name: "Enterprise",
    price: 50,
    listings: 100,
    features: [
      "100 monthly listings",
      "Custom analytics",
      "24/7 support",
      "Featured listings",
      "Bulk upload tools",
      "API access",
      "No commission fees",
    ],
  },
];

export function PricingSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Affordable Subscription Plans for Every Seller
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No percentage-based fees, just simple monthly pricing. Save more as you sell more with 
            our transparent subscription plans.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className="relative p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-[#008080]/10"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="text-5xl font-bold text-[#008080] mb-2">
                  ${plan.price}
                  <span className="text-lg text-gray-500 font-normal">/mo</span>
                </div>
                <p className="text-gray-600">Up to {plan.listings} listings per month</p>
              </div>
              
              <ul className="space-y-4 mb-8 min-h-[280px]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#008080] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full bg-white hover:bg-[#008080] text-[#008080] hover:text-white border-2 border-[#008080] 
                         transition-all duration-300 font-semibold py-6"
              >
                Select Plan
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}