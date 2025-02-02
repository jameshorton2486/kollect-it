import { ArrowRight, CheckCircle2, Shield, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section 
      className="py-20 px-4 text-center bg-gradient-to-b from-shop-50 to-white"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 
          id="hero-heading"
          className="text-4xl md:text-6xl font-bold text-shop-900 leading-tight animate-fade-in"
        >
          Your Trusted Marketplace for Unique Collectibles
        </h1>
        <p className="text-xl text-shop-600 max-w-3xl mx-auto animate-fade-in">
          Discover and trade collectibles across a variety of categories. 
          Whether you're a seasoned collector or just starting your journey, Kollect-It 
          connects you with interesting finds at accessible prices.
        </p>
        
        <div className="space-y-6 animate-fade-in">
          <div 
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
            role="list"
            aria-label="Key features"
          >
            <div 
              className="flex items-center gap-2 text-shop-700"
              role="listitem"
            >
              <Shield className="w-5 h-5 text-green-500" aria-hidden="true" />
              <span>Monthly Listing Fee</span>
            </div>
            <div 
              className="flex items-center gap-2 text-shop-700"
              role="listitem"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
              <span>Expert Authentication Available</span>
            </div>
            <div 
              className="flex items-center gap-2 text-shop-700"
              role="listitem"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
              <span>Honest Descriptions</span>
            </div>
          </div>
        </div>

        <div 
          className="flex gap-4 justify-center pt-6 animate-fade-in"
          role="group"
          aria-label="Main actions"
        >
          <Button 
            size="lg" 
            className="gap-2 bg-shop-accent1 hover:bg-shop-accent1/90"
            onClick={() => window.location.href = '/product-listing'}
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Start Selling</span>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2"
            onClick={() => window.location.href = '/products'}
          >
            <span>Browse Collectibles</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}