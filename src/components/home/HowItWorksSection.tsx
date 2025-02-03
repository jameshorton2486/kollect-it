import { ShoppingCart, CreditCard, Store, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
}

function Testimonial({ content, author, role }: TestimonialProps) {
  return (
    <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-all">
      <div className="flex items-start gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-shop-600 mb-4 italic">"{content}"</p>
      <div>
        <p className="font-semibold text-shop-800">{author}</p>
        <p className="text-sm text-shop-500">{role}</p>
      </div>
    </Card>
  );
}

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

  const testimonials = [
    {
      content: "The subscription model has saved me thousands compared to traditional marketplaces. Highly recommended!",
      author: "Sarah Johnson",
      role: "Vintage Collector"
    },
    {
      content: "Easy to use platform with a great community of collectors. The no-commission approach is fantastic.",
      author: "Michael Chen",
      role: "Antique Dealer"
    },
    {
      content: "Finally, a platform that understands the needs of antique sellers. The pricing is transparent and fair.",
      author: "Emma Thompson",
      role: "Art Dealer"
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
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4 group-hover:shadow-lg transition-all">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-shop-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-shop-900 mb-4">
            What Our Sellers Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}