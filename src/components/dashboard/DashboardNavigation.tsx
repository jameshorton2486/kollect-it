import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function DashboardNavigation() {
  const navigate = useNavigate();

  return (
    <nav className="bg-shop-accent1 shadow-sm sticky top-20 z-10">
      <div className="w-full px-6">
        <div className="flex items-center justify-start h-16 gap-24 overflow-x-auto">
          <Button
            variant="ghost"
            size="lg"
            className="min-w-[120px] text-white hover:bg-white/10 transition-all duration-200
                     relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-white 
                     hover:after:w-1/2 after:transition-all after:duration-200"
            onClick={() => navigate('/buyer-dashboard')}
          >
            Buyers
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="min-w-[120px] text-white hover:bg-white/10 transition-all duration-200
                     relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-white 
                     hover:after:w-1/2 after:transition-all after:duration-200"
            onClick={() => navigate('/seller-dashboard')}
          >
            Sellers
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="min-w-[120px] text-white hover:bg-white/10 transition-all duration-200
                     relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-white 
                     hover:after:w-1/2 after:transition-all after:duration-200"
            onClick={() => navigate('/orders')}
          >
            Orders
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="min-w-[120px] text-white hover:bg-white/10 transition-all duration-200
                     relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-white 
                     hover:after:w-1/2 after:transition-all after:duration-200"
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
        </div>
      </div>
    </nav>
  );
}