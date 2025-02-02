import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Tags,
  Shield,
  Users,
  Store,
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

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Overview", path: "/buyer-dashboard" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: Store, label: "Sellers", path: "/seller-dashboard" },
  { icon: ShoppingCart, label: "Orders", path: "/purchase-history" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { 
    icon: Shield, 
    label: "Admin Panel", 
    path: "/admin-dashboard",
    roles: ["admin"]
  },
  { 
    icon: Tags, 
    label: "Category Management", 
    path: "/category-management",
    roles: ["admin"]
  },
  { 
    icon: Users, 
    label: "User Management", 
    path: "/user-management",
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
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-shop-800">Kollect-It</h1>
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