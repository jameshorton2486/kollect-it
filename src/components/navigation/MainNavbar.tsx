
import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavLinks } from "./NavLinks";
import { UserDropdown } from "./UserDropdown";
import { MobileMenu } from "./MobileMenu";
import { SignUpModal } from "@/components/auth/SignUpModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const mainNavItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Shop", path: "/categories" },
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
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Upper Navigation Bar */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group hover:opacity-90 transition-opacity"
            >
              <h1 className="text-3xl font-bold text-white tracking-tight 
                            shadow-sm transition-all duration-200 group-hover:scale-105">
                Kollect-It
              </h1>
            </Link>

            {!isMobile && (
              <div className="hidden md:flex items-center space-x-8">
                <NavLinks items={mainNavItems} />
                {session ? (
                  <Link 
                    to="/seller-dashboard" 
                    className="text-white hover:text-white/80 px-3 py-2 text-sm font-medium
                             transition-colors duration-200"
                  >
                    Sell
                  </Link>
                ) : null}
              </div>
            )}

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              {!isMobile && (
                <form onSubmit={handleSearch} className="relative w-64">
                  <Input
                    type="search"
                    placeholder="Search antiques..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 bg-white/10 text-white placeholder:text-white/70 
                             border-transparent focus:border-white rounded-full"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                </form>
              )}

              {/* Auth/User Actions */}
              {session ? (
                <div className="flex items-center space-x-4">
                  <Link to="/cart">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:text-white/80 hover:bg-white/10"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </Link>
                  <UserDropdown items={userNavItems} />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/auth" 
                    className="text-white hover:text-white/80 px-3 py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <SignUpModal />
                </div>
              )}

              {/* Mobile Menu */}
              {isMobile && (
                <MobileMenu
                  mainItems={[...mainNavItems, { label: "Sell", path: "/seller-dashboard" }]}
                  adminItems={[]}
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
