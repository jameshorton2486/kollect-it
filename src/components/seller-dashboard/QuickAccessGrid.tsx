
import { Card, CardContent } from "@/components/ui/card";
import { Plus, TrendingUp, ShoppingBag, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickAccessLinks = [
  {
    title: "Add New Product",
    icon: Plus,
    description: "List a new item for sale",
    path: "/seller/products/new"
  },
  {
    title: "Sales Analytics",
    icon: TrendingUp,
    description: "View detailed sales reports and trends",
    path: "/seller/analytics"
  },
  {
    title: "Orders",
    icon: ShoppingBag,
    description: "Track and manage customer orders",
    path: "/seller/orders"
  },
  {
    title: "Settings",
    icon: Settings,
    description: "Configure your shop preferences",
    path: "/seller/settings"
  }
];

export function QuickAccessGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickAccessLinks.map((link) => (
        <Card 
          key={link.title}
          className="hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => navigate(link.path)}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <link.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{link.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {link.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
