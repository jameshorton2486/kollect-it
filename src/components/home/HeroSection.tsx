import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-nav py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Discover Unique Collectibles
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Find extraordinary pieces from trusted sellers. Every item is verified for authenticity.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-shop-accent1 hover:bg-shop-600 text-white"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Collection
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/featured")}
            >
              <Star className="mr-2 h-5 w-5" />
              Featured Items
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}