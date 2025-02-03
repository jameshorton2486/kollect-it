import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function DashboardNavigation() {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-20 z-10">
      <div className="w-full px-2 md:px-4">
        <div className="flex items-center justify-between h-16 gap-6 overflow-x-auto">
          <Button
            variant="ghost"
            size="lg"
            className="min-w-[120px] hover:bg-gray-100 transition-all duration-200 rounded-full
                     relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-shop-accent1 
                     hover:after:w-1/2 after:transition-all after:duration-200"
            onClick={() => navigate('/buyer-dashboard')}
          >
            Buyers
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="min-w-[120px] hover:bg-gray-100 transition-all duration-200 rounded-full
                     relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-shop-accent1 
                     hover:after:w-1/2 after:transition-all after:duration-200"
            onClick={() => navigate('/seller-dashboard')}
          >
            Sellers
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="min-w-[120px] hover:bg-gray-100 transition-all duration-200 rounded-full
                     relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-shop-accent1 
                     hover:after:w-1/2 after:transition-all after:duration-200"
            onClick={() => navigate('/orders')}
          >
            Orders
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="min-w-[120px] hover:bg-gray-100 transition-all duration-200 rounded-full
                     relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-shop-accent1 
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