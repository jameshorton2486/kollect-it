import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-[#008080] to-[#006666] py-20 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10" />
      
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="text-left space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Your Online 
            <span className="block">Antique Store</span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-xl">
            Join our curated marketplace for unique antiques and collectibles. 
            List your items with our seller-friendly subscription plans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="bg-white text-[#008080] hover:bg-white/90 text-lg px-8"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Collection
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-[#008080] bg-white text-[#008080] hover:bg-white/90 text-lg px-8"
              onClick={() => navigate("/pricing")}
            >
              <Star className="mr-2 h-5 w-5" />
              View Pricing Plans
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-8">
            <div className="text-white/90">
              <div className="text-2xl font-bold">1000+</div>
              <div className="text-sm">Unique Items</div>
            </div>
            <div className="text-white/90">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">Active Sellers</div>
            </div>
            <div className="text-white/90">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm">Support</div>
            </div>
          </div>
        </div>

        <div className="hidden md:block relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#008080]/20 to-transparent rounded-lg" />
          <img
            src="/placeholder.svg"
            alt="Featured Antiques"
            className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}