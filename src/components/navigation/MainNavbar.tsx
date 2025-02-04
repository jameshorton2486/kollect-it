import { Link } from "react-router-dom";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavLinks } from "./NavLinks";
import { AdminDropdown } from "./AdminDropdown";
import { UserDropdown } from "./UserDropdown";
import { MobileMenu } from "./MobileMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const mainNavItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const shopCategories = [
  { label: "Antiques", path: "/categories/antiques" },
  { label: "Collectibles", path: "/categories/collectibles" },
  { label: "Art", path: "/categories/art" },
  { label: "Furniture", path: "/categories/furniture" },
  { label: "Jewelry", path: "/categories/jewelry" },
  { label: "Books", path: "/categories/books" },
];

const adminNavItems = [
  { label: "Dashboard", path: "/admin-dashboard" },
  { label: "Category Management", path: "/category-management" },
  { label: "User Management", path: "/user-management" },
];

const userNavItems = [
  { label: "My Dashboard", path: "/buyer-dashboard" },
  { label: "Purchase History", path: "/purchase-history" },
  { label: "Settings", path: "/settings" },
];

export function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  // Check authentication status
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  return (
    <nav className="bg-[#156064] border-b border-[#0F4447] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Kollect-It</h1>
          </Link>

          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              <NavLinks items={mainNavItems} />
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-white hover:text-white/80">
                      Shop
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {shopCategories.map((category) => (
                          <li key={category.path}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={category.path}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {category.label}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {session ? (
                <>
                  <Link 
                    to="/seller-dashboard" 
                    className="text-white hover:text-white/80 px-3 py-2 text-sm font-medium"
                  >
                    Sell
                  </Link>
                  <AdminDropdown items={adminNavItems} />
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/auth" 
                    className="text-white hover:text-white/80 px-3 py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Button 
                    asChild
                    variant="secondary" 
                    className="bg-white text-[#156064] hover:bg-white/90"
                  >
                    <Link to="/auth?signup=true">
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search antiques..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 bg-white/10 text-white placeholder:text-white/70 border-transparent focus:border-white"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {session && (
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {session && <UserDropdown items={userNavItems} />}

            {isMobile && (
              <MobileMenu
                mainItems={[...mainNavItems, { label: "Shop", path: "/categories" }, { label: "Sell", path: "/seller-dashboard" }]}
                adminItems={adminNavItems}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}