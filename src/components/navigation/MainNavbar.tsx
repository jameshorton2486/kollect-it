import { Link } from "react-router-dom";
import { Menu, ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Categories", path: "/categories" },
  { label: "Blog", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "FAQ", path: "/faq" },
];

const userNavigationItems = [
  { label: "Dashboard", path: "/buyer-dashboard" },
  { label: "Purchase History", path: "/purchase-history" },
  { label: "Personal Collection", path: "/personal-collection" },
];

export function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Search query:", searchQuery);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-shop-800">Kollect-It</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <div className="hidden md:flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-shop-600 hover:text-shop-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search collectibles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </form>
              </div>
            </>
          )}

          <div className="flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {/* Add cart items count badge here if needed */}
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  {/* Mobile Search */}
                  <div className="mb-6">
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Input
                          type="search"
                          placeholder="Search collectibles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </form>
                  </div>
                  
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="text-shop-600 hover:text-shop-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-200 my-2" />
                    {userNavigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="text-shop-600 hover:text-shop-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}