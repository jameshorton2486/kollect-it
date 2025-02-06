
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
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
    <nav className="bg-shop-700 border-b border-shop-800/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Kollect-It</h1>
          </Link>

          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              <NavLinks items={mainNavItems} />

              {session ? (
                <>
                  <Link 
                    to="/seller-dashboard" 
                    className="text-white hover:text-white/80 px-3 py-2 text-sm font-medium"
                  >
                    Sell
                  </Link>
                  <UserDropdown items={userNavItems} />
                </>
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
    </nav>
  );
}
