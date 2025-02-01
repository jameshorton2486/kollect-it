import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  Tags,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  roles?: string[];
}

// Admin-only menu items
const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: Tags, label: "Categories", path: "/categories" },
  { icon: ShoppingCart, label: "Orders", path: "/orders" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { 
    icon: Shield, 
    label: "Admin Dashboard", 
    path: "/admin",
    roles: ["admin"]
  },
  { 
    icon: Tags, 
    label: "Category Management", 
    path: "/admin/categories",
    roles: ["admin"]
  },
  { 
    icon: Users, 
    label: "User Management", 
    path: "/admin/users",
    roles: ["admin"]
  },
];

export function DashboardSidebar() {
  const { data: userRoles } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      return roles?.map(r => r.role) || [];
    }
  });

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return userRoles?.some(role => item.roles?.includes(role));
  });

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 overflow-y-auto animate-slideIn">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-shop-800">Admin Panel</h1>
      </div>
      <nav className="px-4 py-2">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-shop-600 hover:bg-shop-50 rounded-lg transition-colors",
              "hover:text-shop-900 group"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}