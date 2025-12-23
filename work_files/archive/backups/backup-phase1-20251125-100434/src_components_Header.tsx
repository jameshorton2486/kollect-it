"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartIcon from "@/components/CartIcon";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-lux-white/95 backdrop-blur-md shadow-sm"
          : "bg-lux-cream"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="font-logo text-xl md:text-2xl tracking-tight text-lux-black">
              Kollect
            </span>
            <span className="font-logo text-xl md:text-2xl tracking-tight text-lux-gold">
              -It
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-lux-gray-dark hover:text-lux-black transition-colors tracking-wide group"
              >
                {link.label}
                {/* Underline animation on hover */}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-lux-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Search */}
            <button
              aria-label="Search"
              className="p-2 text-lux-gray hover:text-lux-black transition-colors"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Account */}
            <Link
              href="/account"
              className="p-2 text-lux-gray hover:text-lux-black transition-colors hidden sm:block"
              aria-label="Account"
            >
              <User className="w-5 h-5" strokeWidth={1.5} />
            </Link>

            {/* Cart */}
            <CartIcon />

            {/* Sell Button - Desktop */}
            <Button
              asChild
              className="hidden md:inline-flex bg-lux-black hover:bg-lux-charcoal text-lux-white font-medium px-6"
            >
              <Link href="/sell">Sell With Us</Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-lux-gray-dark hover:text-lux-black transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" strokeWidth={1.5} />
              ) : (
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-lux-silver animate-slide-down">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-lux-gray-dark hover:text-lux-black transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-lux-silver">
                <Button
                  asChild
                  className="w-full bg-lux-black hover:bg-lux-charcoal text-lux-white font-medium"
                >
                  <Link href="/sell" onClick={() => setIsMenuOpen(false)}>
                    Sell With Us
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
