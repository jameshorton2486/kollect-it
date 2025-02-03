import { Store, ShoppingCart, CreditCard } from "lucide-react";
import { ProcessStep } from "./how-it-works/ProcessStep";
import { TestimonialGrid } from "./how-it-works/TestimonialGrid";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Store,
      title: "Choose Your Plan",
      description: "Select a subscription plan that fits your inventory needs"
    },
    {
      icon: ShoppingCart,
      title: "List Your Items",
      description: "Upload your antiques and collectibles with detailed descriptions"
    },
    {
      icon: CreditCard,
      title: "Start Selling",
      description: "Connect with buyers and sell without commission fees"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-shop-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-shop-900 mb-4">
          Start Selling Today
        </h2>
        <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
          Join our community of sellers and benefit from our subscription-based model
        </p>
        
        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <ProcessStep key={index} {...step} />
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-shop-900 mb-4">
            What Our Sellers Say
          </h3>
          <TestimonialGrid />
        </div>
      </div>
    </section>
  );
}