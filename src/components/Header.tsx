"use client";

import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Kollect-It Luxury Header
 * Dark charcoal header matching footer (bg-lux-charcoal)
 */
export default function Header() {
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
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 transition-all duration-300",
        isScrolled
          ? "bg-lux-charcoal/95 backdrop-blur-md shadow-lg"
          : "bg-lux-charcoal"
      )}
    >
      <nav
        className="container mx-auto px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <div className="flex h-18 items-center justify-between gap-6 py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-lux-cream group-hover:text-lux-white transition-colors duration-200 tracking-tight">
                Kollect
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-lux-gold group-hover:text-lux-gold-light transition-colors duration-200 tracking-tight">
                -It
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
            {navigation.map((item) => {
              const isActive = isLinkActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative font-serif text-heading-xs tracking-wide transition-colors duration-200 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal",
                    isActive
                      ? "text-lux-cream"
                      : "text-lux-cream hover:text-lux-gold-light",
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
          <div className="hidden md:flex items-center gap-6">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-lux-cream hover:text-lux-gold-light hover:bg-white/5 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
            >
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-lux-cream hover:text-lux-gold-light hover:bg-white/5 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-lux-cream hover:text-lux-gold-light hover:bg-white/5 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
            >
              <Link href="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-lux-cream hover:text-lux-gold-light hover:bg-white/5 rounded-full relative transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            {/* Consign Button */}
            <Button
              asChild
              className="ml-4 rounded-full bg-lux-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider text-lux-charcoal hover:bg-lux-gold-light hover:scale-[1.02] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
            >
              <Link href="/consign">Consign</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-lux-cream hover:text-lux-gold-light hover:bg-white/10 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
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
              className="h-10 w-10 text-lux-cream hover:text-lux-gold-light hover:bg-white/10 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
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
            className="md:hidden absolute left-0 right-0 top-full bg-lux-charcoal border-b border-white/10 shadow-2xl"
          >
            <nav className="flex flex-col px-4 py-4" aria-label="Mobile navigation">
              {navigation.map((item) => {
                const isActive = isLinkActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "font-serif text-base py-3.5 border-b border-white/5 last:border-0 tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal",
                      isActive
                        ? "text-lux-gold"
                        : "text-lux-cream hover:text-lux-gold-light",
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
                  className="flex items-center gap-3 py-3 text-sm text-lux-cream hover:text-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 text-lux-cream" />
                  My Account
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 py-3 text-sm text-lux-cream hover:text-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5 text-lux-cream" />
                  Wishlist
                </Link>
                <Link
                  href="/search"
                  className="flex items-center gap-3 py-3 text-sm text-lux-cream hover:text-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="h-5 w-5 text-lux-cream" />
                  Search
                </Link>
                <Link
                  href="/consign"
                  className="flex items-center gap-3 py-3 text-sm font-semibold text-lux-gold hover:text-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Consign
                </Link>
              </div>
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}
