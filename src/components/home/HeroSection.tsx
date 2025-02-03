import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[#008080] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Your Online Antique Store
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Sell antiques and collectibles without paying high commission fees. List 30 items for $20, 
            50 for $30, or 100 for $50 a month.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-white text-[#008080] hover:bg-white/90"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Collection
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/pricing")}
            >
              <Star className="mr-2 h-5 w-5" />
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}