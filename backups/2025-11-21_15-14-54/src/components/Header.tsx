"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Add shadow only when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Browse", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-surface-50/90 backdrop-blur-md border-border-300 shadow-sm"
          : "bg-surface-50 border-transparent"
      }`}
    >
      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="flex items-center justify-between h-20 transition-all duration-300">
          
          {/* Logo - Two Tone for Elegance */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="font-serif text-3xl font-bold text-ink-900 tracking-tight">
                Kollect<span className="text-gold-600 group-hover:text-gold-500 transition-colors">-It</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-10">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-sans font-medium tracking-wide transition-colors uppercase",
                    isActive 
                      ? "text-gold-600" 
                      : "text-ink-600 hover:text-gold-600"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button asChild variant="ghost" size="icon" className="text-ink-600 hover:text-ink-900 hover:bg-surface-200">
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="icon" className="text-ink-600 hover:text-ink-900 hover:bg-surface-200">
              <Link href="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="icon" className="text-ink-600 hover:text-ink-900 hover:bg-surface-200 relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                {/* Optional Badge */}
                {/* <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-semantic-error-500" /> */}
              </Link>
            </Button>

            <div className="pl-2">
              <Button asChild className="bg-cta-600 hover:bg-cta-700 text-white font-medium rounded-full px-6">
                <Link href="/sell">Sell Item</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <Button asChild variant="ghost" size="icon" className="text-ink-600">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-ink-900"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-surface-50 border-b border-border-300 shadow-lg animate-slide-down">
            <div className="flex flex-col p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-lg font-serif font-medium py-3 border-b border-border-200 last:border-0",
                      isActive ? "text-gold-600" : "text-ink-800"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="pt-4 flex gap-4">
                <Button asChild className="w-full bg-cta-600 text-white">
                  <Link href="/sell">Sell With Us</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-ink-200">
                  <Link href="/account">My Account</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
