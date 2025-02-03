import { ShoppingCart, CreditCard, Store } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: <Store className="w-8 h-8" />,
      title: "Choose Your Plan",
      description: "Select a subscription plan that fits your inventory needs"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "List Your Items",
      description: "Upload your antiques and collectibles with detailed descriptions"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Start Selling",
      description: "Connect with buyers and sell without commission fees"
    }
  ];

  return (
    <section className="py-20 px-4 bg-shop-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-shop-900 mb-4">
          Start Selling Today
        </h2>
        <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
          Simple steps to begin selling your antiques and collectibles with our subscription model
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-shop-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}