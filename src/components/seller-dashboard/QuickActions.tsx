import { Button } from "@/components/ui/button";
import { Plus, List, BarChart3, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  { 
    title: "Add New Product", 
    icon: Plus, 
    description: "Create new product listings with our streamlined tools",
    path: "/products/new"
  },
  { 
    title: "Manage Inventory", 
    icon: List, 
    description: "Update and organize your product inventory efficiently",
    path: "/products"
  },
  { 
    title: "View Analytics", 
    icon: BarChart3, 
    description: "Gain insights from detailed performance metrics",
    path: "/sales-analytics"
  },
  { 
    title: "Settings", 
    icon: Settings, 
    description: "Customize your seller profile and preferences",
    path: "/settings"
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-shop-800 mb-4">
        Discover deep insights into your sales data
      </h2>
      <p className="text-shop-600 mb-6">
        Understand customer buying patterns, monitor sales progress, and uncover new opportunities 
        for growth with detailed metrics. Visualize your performance and make data-driven decisions 
        to optimize your business strategy.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            onClick={() => navigate(action.path)}
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-shop-50 transition-all duration-200 group"
          >
            <action.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span>{action.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}