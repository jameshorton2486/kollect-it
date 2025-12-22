"use client";

import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Kollect-It Luxury Header
 * Clean dark header with improved spacing and gold accents
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/browse" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 text-lux-white transition-all duration-300",
        isScrolled
          ? "bg-[#0D0D0D]/95 backdrop-blur-md shadow-lg"
          : "bg-[#0D0D0D]"
      )}
    >
      {/* Simplified top bar - just email */}
      <div className="hidden border-b border-white/5 px-4 py-2.5 sm:block">
        <div className="mx-auto max-w-6xl flex justify-end">
          <a 
            href="mailto:james@kollect-it.com" 
            className="text-[0.7rem] font-medium tracking-[0.2em] text-lux-pearl/70 hover:text-white transition-colors"
          >
            james@kollect-it.com
          </a>
        </div>
      </div>

      <nav
        className="mx-auto max-w-6xl px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <div className="flex h-18 items-center justify-between gap-6 py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-lux-pearl transition-colors tracking-tight">
                Kollect
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-lux-gold group-hover:text-lux-gold-light transition-colors tracking-tight">
                -It
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Improved spacing */}
          <div className="hidden md:flex md:items-center md:gap-10 lg:gap-12">
            {navigation.map((item) => {
              const isActive = isLinkActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative text-[0.75rem] font-semibold tracking-[0.2em] uppercase transition-all duration-200 py-1",
                    isActive
                      ? "text-white"
                      : "text-lux-pearl/70 hover:text-white",
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-lux-gold" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-lux-pearl/70 hover:text-white hover:bg-white/5 rounded-full"
            >
              <Link href="/search">
                <Search className="h-[18px] w-[18px]" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-lux-pearl/70 hover:text-white hover:bg-white/5 rounded-full"
            >
              <Link href="/wishlist">
                <Heart className="h-[18px] w-[18px]" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-lux-pearl/70 hover:text-white hover:bg-white/5 rounded-full"
            >
              <Link href="/account">
                <User className="h-[18px] w-[18px]" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-lux-pearl/70 hover:text-white hover:bg-white/5 rounded-full relative"
            >
              <Link href="/cart">
                <ShoppingCart className="h-[18px] w-[18px]" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white hover:bg-white/10 rounded-full"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">View cart</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-10 w-10 text-white hover:bg-white/10 rounded-full"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden absolute left-0 right-0 top-full bg-[#0D0D0D] border-b border-white/10 shadow-2xl"
          >
            <div className="flex flex-col px-4 py-4">
              {navigation.map((item) => {
                const isActive = isLinkActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-base font-medium py-3.5 border-b border-white/5 last:border-0 tracking-[0.15em] uppercase transition-colors",
                      isActive
                        ? "text-lux-gold"
                        : "text-lux-pearl/80 hover:text-white",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Quick Links */}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 py-3 text-sm text-lux-pearl/70 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  My Account
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 py-3 text-sm text-lux-pearl/70 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Link>
                <Link
                  href="/search"
                  className="flex items-center gap-3 py-3 text-sm text-lux-pearl/70 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="h-4 w-4" />
                  Search
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
