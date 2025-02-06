
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-[#308cc0] to-[#145da0] py-16 px-4 md:px-8">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10" />
      
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Your Online 
            <span className="block animate-fade-in">Antique Store</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-xl animate-slide-in">
            Join our curated marketplace for unique antiques and collectibles. 
            List your items with our seller-friendly subscription plans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white hover:bg-white/90 text-[#308cc0] text-lg px-8 
                       transform transition-all duration-200 hover:-translate-y-1"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Collection
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white bg-transparent text-white 
                       hover:bg-white/10 text-lg px-8 transform transition-all duration-200 
                       hover:-translate-y-1"
              onClick={() => navigate("/pricing")}
            >
              <Star className="mr-2 h-5 w-5" />
              View Pricing
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
          className="hidden md:block relative h-[400px] w-full max-w-[500px] ml-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#308cc0]/20 to-transparent rounded-lg" />
          <img
            src="/placeholder.svg"
            alt="Featured Antiques"
            className="w-full h-full object-cover rounded-lg shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
