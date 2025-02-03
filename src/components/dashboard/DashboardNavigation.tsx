import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Store, Package, Settings } from "lucide-react";

export function DashboardNavigation() {
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Buyers",
      path: "/buyer-dashboard",
      icon: Users,
      ariaLabel: "Navigate to buyers dashboard"
    },
    {
      label: "Sellers",
      path: "/seller-dashboard",
      icon: Store,
      ariaLabel: "Navigate to sellers dashboard"
    },
    {
      label: "Orders",
      path: "/orders",
      icon: Package,
      ariaLabel: "View orders"
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
      ariaLabel: "Manage settings"
    }
  ];

  return (
    <nav className="bg-shop-accent1 shadow-sm sticky top-20 z-10">
      <div className="w-full px-6 overflow-x-auto">
        <div className="flex items-center justify-start h-16 gap-4 md:gap-8">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="lg"
              aria-label={item.ariaLabel}
              className="min-w-[120px] text-white hover:bg-white/10 transition-all duration-200
                       relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                       after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-white 
                       hover:after:w-1/2 after:transition-all after:duration-200
                       focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
                       focus-visible:ring-offset-shop-accent1"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}