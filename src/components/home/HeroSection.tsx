import { ArrowRight, CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-b from-shop-50 to-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-shop-900 leading-tight">
          Discover Unique Collectibles and Fine Art
        </h1>
        <p className="text-xl text-shop-600 max-w-3xl mx-auto">
          Explore our curated selection of rare collectibles and exquisite fine art. Whether you're a seasoned collector or just starting your journey, Kollect-It connects you with a passionate community and the most sought-after pieces in the market.
        </p>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-2 text-shop-700">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Shop from Trusted Sellers</span>
            </div>
            <div className="flex items-center gap-2 text-shop-700">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Find One-of-a-Kind Collectibles</span>
            </div>
            <div className="flex items-center gap-2 text-shop-700">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Join a Thriving Collector Community</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-center pt-6">
          <Button size="lg" className="gap-2">
            Shop Now <ShoppingBag className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            Learn More <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}