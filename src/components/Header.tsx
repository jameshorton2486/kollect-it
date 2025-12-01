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
        "sticky top-0 z-50 border-b border-white/10 text-lux-white transition-colors",
        isScrolled
          ? "bg-lux-black/90 backdrop-blur supports-[backdrop-filter]:bg-lux-black/75 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          : "bg-lux-black"
      )}
    >
      <div className="hidden border-b border-white/5 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-lux-gray-light/80 sm:flex sm:justify-between">
        <span>Certified consignments • Worldwide delivery</span>
        <span className="hidden md:inline">Concierge: james@kollect-it.com</span>
      </div>
      <nav
        className="mx-auto flex max-w-6xl flex-col px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo - White + Gold for Dark Header */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="font-serif text-3xl font-bold text-white group-hover:text-lux-gray-light transition-colors tracking-tight">
                Kollect
              </span>
              <span className="font-serif text-3xl font-bold text-lux-gold group-hover:text-lux-gold-light transition-colors tracking-tight">
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
                    "relative text-[0.72rem] font-semibold tracking-[0.28em] uppercase transition-colors pb-1 border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-black",
                    isActive
                      ? "text-white border-white"
                      : "text-lux-gray-light/70 hover:text-white border-transparent hover:border-white/60",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Search */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-lux-gray-light/80 hover:text-white hover:bg-white/5"
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
              className="text-lux-gray-light/80 hover:text-white hover:bg-white/5"
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
              className="text-lux-gray-light/80 hover:text-white hover:bg-white/5"
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
              className="text-lux-gray-light/80 hover:text-white hover:bg-white/5 relative"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            {/* Consign CTA - Desktop */}
            <div className="pl-3">
              <Button
                asChild
                variant="gold"
                className="font-semibold tracking-[0.2em] rounded-full px-6 uppercase text-[0.7rem]"
              >
                <Link href="/sell">Consign</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            {/* Mobile Cart */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">View cart</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
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
              className="text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold"
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
            className="md:hidden absolute left-0 right-0 top-full bg-lux-black/95 border-b border-white/10 shadow-2xl animate-slide-down"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = isLinkActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                    "text-base font-semibold py-3 border-b border-white/10 last:border-0 tracking-[0.2em] uppercase transition-colors",
                      isActive
                      ? "text-lux-gold-light"
                      : "text-lux-pearl/80 hover:text-white",
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
                  className="w-full bg-lux-gold text-lux-black hover:bg-lux-gold-light"
                >
                  <Link href="/sell">Consign</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/5"
                >
                  <Link href="/account">My Account</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/5"
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
