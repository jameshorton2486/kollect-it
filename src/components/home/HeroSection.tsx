
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-shop-700 to-shop-900 py-16 px-4 md:px-8">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
      
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-6"
        >
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 bg-shop-accent1/20 text-shop-accent1 rounded-full text-sm font-medium">
              Trusted Marketplace for Premium Pre-Owned Goods
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-display">
              Discover Rare & 
              <span className="block mt-2">Unique Collectibles</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-white/90 max-w-xl font-sans">
            Join our curated marketplace featuring exceptional pre-owned items, 
            verified sellers, and secure transactions.
          </p>
          
          <div className="relative max-w-xl">
            <Input 
              type="search"
              placeholder="Search for collectibles..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white focus:text-shop-900 focus:placeholder:text-shop-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-shop-accent1 hover:bg-shop-accent1/90 text-white text-lg px-8 
                       transform transition-all duration-200 hover:-translate-y-1 uppercase font-sans tracking-wide 
                       min-h-[3rem] touch-manipulation"
              onClick={() => navigate("/products")}
              aria-label="Browse our product collection"
            >
              <ShoppingBag className="mr-2 h-5 w-5" aria-hidden="true" />
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white bg-transparent text-white 
                       hover:bg-white/10 text-lg px-8 transform transition-all duration-200 
                       hover:-translate-y-1 uppercase font-sans tracking-wide min-h-[3rem] touch-manipulation"
              onClick={() => navigate("/seller-dashboard")}
              aria-label="Start selling your items"
            >
              <Star className="mr-2 h-5 w-5" aria-hidden="true" />
              Sell Now
            </Button>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10"
          >
            <div className="text-white">
              <div className="text-2xl font-bold font-display">$100-3K</div>
              <div className="text-sm text-white/80">Price Range</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold font-display">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold font-display">100%</div>
              <div className="text-sm text-white/80">Secure</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block relative h-[500px] w-full max-w-[500px] ml-auto"
          role="img"
          aria-label="Featured premium collectibles showcase"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-shop-accent1/20 to-transparent rounded-lg" />
          <img
            src="/placeholder.svg"
            alt="Featured Premium Items"
            className="w-full h-full object-cover rounded-lg shadow-2xl"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-shop-900/90 to-transparent rounded-b-lg">
            <div className="text-white">
              <p className="text-sm font-medium text-shop-accent1">Featured Collection</p>
              <h3 className="text-xl font-bold font-display">Vintage Timepieces</h3>
              <p className="text-sm text-white/80 mt-1">Starting from $499</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
