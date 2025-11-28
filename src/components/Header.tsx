"use client";

import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Kollect-It Luxury Header
 * Phase 1 Update: Dark header with gold accents
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Adds subtle backdrop when scrolling to match luxury polish
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
    { name: "How It Works", href: "/how-it-works" },
    { name: "FAQ", href: "/faq" },
    { name: "About", href: "/about" },
    { name: "Consign", href: "/sell" },
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
        "sticky top-0 z-50 border-b border-lux-silver/40 text-lux-ink-soft",
        isScrolled ? "bg-surface-900/95 backdrop-blur" : "bg-surface-900"
      )}
    >
      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="flex items-center justify-between h-14 md:h-16 transition-all duration-300 gap-4">
          {/* Logo - White + Gold for Dark Header */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="font-serif text-3xl font-bold text-white group-hover:text-surface-200 transition-colors tracking-tight">
                Kollect
              </span>
              <span className="font-serif text-3xl font-bold text-gold-500 group-hover:text-gold-400 transition-colors tracking-tight">
                -It
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => {
              const isActive = isLinkActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-light tracking-[0.08em] uppercase transition-colors pb-1 border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900",
                    isActive
                      ? "text-lux-ink-soft border-lux-silver"
                      : "text-lux-ink-soft/80 hover:text-lux-ink-soft border-transparent hover:border-lux-silver",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-lux-ink-soft/80 hover:text-lux-ink-soft hover:bg-surface-800"
            >
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>

            {/* Wishlist */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-lux-ink-soft/80 hover:text-lux-ink-soft hover:bg-surface-800"
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            {/* Account */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-lux-ink-soft/80 hover:text-lux-ink-soft hover:bg-surface-800"
            >
              <Link href="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>

            {/* Cart */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-lux-ink-soft/80 hover:text-lux-ink-soft hover:bg-surface-800 relative"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            {/* Consign CTA - Desktop */}
            <div className="pl-2">
              <Button
                asChild
                variant="outline"
                className="font-normal tracking-wide rounded-full px-6 border-lux-gold text-lux-ink-soft hover:bg-lux-gold hover:text-surface-900"
              >
                <Link href="/sell">Consign</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Mobile Cart */}
            <Button asChild variant="ghost" size="icon" className="text-white">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">View cart</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" size="icon" className="text-white">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">View wishlist</span>
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
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
          <div
            id="mobile-menu"
            className="md:hidden absolute left-0 right-0 top-full bg-surface-900 border-b border-surface-800 shadow-lg animate-slide-down"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = isLinkActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-lg font-light py-3 border-b border-surface-800 last:border-0 tracking-wide transition-colors",
                      isActive
                        ? "text-gold-500"
                        : "text-surface-200 hover:text-white",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile CTAs */}
              <div className="pt-4 flex flex-col gap-3">
                <Button
                  asChild
                  className="w-full bg-gold-500 text-surface-900 hover:bg-gold-400"
                >
                  <Link href="/sell">Consign</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-surface-300 text-white hover:bg-surface-800"
                >
                  <Link href="/account">My Account</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-surface-300 text-white hover:bg-surface-800"
                >
                  <Link href="/wishlist">Wishlist</Link>
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
