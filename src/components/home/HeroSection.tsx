import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-[#008080] to-[#006666] section-padding">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10" />
      
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-6"
        >
          <h1 className="heading-responsive text-white leading-tight">
            Your Online 
            <span className="block animate-fade-in">Antique Store</span>
          </h1>
          
          <p className="text-responsive text-white/90 max-w-xl animate-slide-in">
            Join our curated marketplace for unique antiques and collectibles. 
            List your items with our seller-friendly subscription plans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="bg-white text-[#008080] hover:bg-white/90 text-lg px-8 hover-lift"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Collection
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white bg-transparent text-white hover:bg-white/10 text-lg px-8 hover-lift"
              onClick={() => navigate("/pricing")}
            >
              <Star className="mr-2 h-5 w-5" />
              View Pricing Plans
            </Button>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-8 pt-8"
          >
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
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#008080]/20 to-transparent rounded-lg" />
          <img
            src="/placeholder.svg"
            alt="Featured Antiques"
            className="w-full h-[500px] object-cover rounded-lg shadow-2xl image-responsive"
          />
        </motion.div>
      </div>
    </section>
  );
}