
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Tags,
  Shield,
  Users,
  Store,
  BarChart,
  CreditCard,
  FileText,
  Bell,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  roles?: string[];
  subcategories?: { label: string; path: string }[];
}

export function DashboardSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [openCategories, setOpenCategories] = useState(false);
  
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

  const { data: categories } = useQuery({
    queryKey: ["categories-with-subcategories"],
    queryFn: async () => {
      const { data: categories, error } = await supabase
        .from("categories")
        .select(`
          id,
          name,
          subcategories (
            id,
            name
          )
        `)
        .order('name');
      
      if (error) throw error;
      return categories;
    }
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: "Overview", path: "/buyer-dashboard" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: Store, label: "Sellers", path: "/seller-dashboard" },
    { icon: ShoppingCart, label: "Orders", path: "/purchase-history" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    
    // Seller specific items
    { icon: CreditCard, label: "Subscription", path: "/seller/subscription", roles: ["seller"] },
    { icon: Package, label: "Inventory", path: "/seller/inventory", roles: ["seller"] },
    { icon: BarChart, label: "Analytics", path: "/seller/analytics", roles: ["seller"] },
    { icon: Tags, label: "Listings", path: "/seller/listings", roles: ["seller"] },
    
    // Settings for all users
    { icon: Settings, label: "Settings", path: "/settings" },
    
    // Admin specific items
    { icon: Shield, label: "Admin Overview", path: "/admin-dashboard", roles: ["admin"] },
    { icon: Users, label: "User Management", path: "/user-management", roles: ["admin"] },
    { icon: FileText, label: "Content Management", path: "/content-management", roles: ["admin"] },
    { icon: Tags, label: "Category Management", path: "/category-management", roles: ["admin"] },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return userRoles?.some(role => item.roles?.includes(role));
  });

  return (
    <div className="h-screen w-64 bg-[#308cc0] border-r border-[#308cc0]/20 fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-white nav-brand">Kollect-It</h1>
      </div>
      <nav className="px-4 py-2 flex flex-col justify-between h-[calc(100vh-100px)]">
        <div className="space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition-colors",
                "hover:text-white group"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <Collapsible
            open={openCategories}
            onOpenChange={setOpenCategories}
            className="mt-4"
          >
            <CollapsibleTrigger className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full hover:text-white">
              <Tags className="w-5 h-5" />
              <span className="font-medium flex-1 text-left">Categories</span>
              {openCategories ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 ml-4 space-y-1">
              {categories?.map((category) => (
                <Collapsible key={category.id}>
                  <CollapsibleTrigger className="flex items-center gap-3 px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors w-full text-sm hover:text-white">
                    <span className="flex-1 text-left">{category.name}</span>
                    <ChevronRight className="w-3 h-3" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 space-y-1">
                    {category.subcategories?.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/categories/${category.id}/${sub.id}`}
                        className="flex items-center gap-3 px-4 py-2 text-white/60 hover:bg-white/10 rounded-lg transition-colors text-sm hover:text-white"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition-colors mt-auto",
            "hover:text-white group w-full"
          )}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
}
