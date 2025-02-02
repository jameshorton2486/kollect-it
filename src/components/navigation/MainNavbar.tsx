import { Link } from "react-router-dom";
import { Menu, ShoppingCart, User, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const mainNavigationItems = [
  { label: "Home", path: "/" },
  { label: "New Arrivals", path: "/new-arrivals" },
];

const shopNavigationItems = [
  { label: "Products", path: "/products" },
  { label: "Categories", path: "/categories" },
];

const helpNavigationItems = [
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
  { label: "About", path: "/about" },
];

const userNavigationItems = [
  { label: "Dashboard", path: "/buyer-dashboard" },
  { label: "Purchase History", path: "/purchase-history" },
  { label: "Personal Collection", path: "/personal-collection" },
  { label: "Settings", path: "/settings" },
];

export function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  return (
    <nav className="bg-shop-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-white">Kollect-It</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <div className="hidden md:flex items-center space-x-8">
                {/* Main Navigation */}
                {mainNavigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </Link>
                ))}

                {/* Shop Navigation */}
                <div className="relative group">
                  <button className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 relative group">
                    Shop
                    <ChevronDown className="h-4 w-4" />
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {shopNavigationItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-shop-800 hover:bg-shop-50"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Help Navigation */}
                <div className="relative group">
                  <button className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 relative group">
                    Help
                    <ChevronDown className="h-4 w-4" />
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {helpNavigationItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-shop-800 hover:bg-shop-50"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
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
                      className="w-full pr-10 bg-white/10 text-white placeholder:text-gray-300 border-gray-700"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
                  </div>
                </form>
              </div>
            </>
          )}

          <div className="flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-white hover:text-gray-200">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-gray-200">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userNavigationItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/auth" className="w-full">
                    Sign Out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            {isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:text-gray-200">
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
                    <div>
                      <h3 className="font-semibold mb-2">Main</h3>
                      {mainNavigationItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-shop-600 hover:text-shop-900"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Shop</h3>
                      {shopNavigationItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-shop-600 hover:text-shop-900"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Help</h3>
                      {helpNavigationItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-shop-600 hover:text-shop-900"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Account</h3>
                      {userNavigationItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-shop-600 hover:text-shop-900"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <Link
                        to="/auth"
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-shop-600 hover:text-shop-900"
                      >
                        Sign Out
                      </Link>
                    </div>
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