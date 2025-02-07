
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
    path: "/profile-settings"
  }
];

export function QuickAccessGrid() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-3">
          {quickAccessLinks.map((link) => (
            <button
              key={link.title}
              className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-accent transition-colors text-left"
              onClick={() => navigate(link.path)}
            >
              <div className="p-2 bg-primary/10 rounded-full">
                <link.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">{link.title}</div>
                <div className="text-xs text-muted-foreground">
                  {link.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
