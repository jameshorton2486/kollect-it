"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Browse", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="font-serif text-2xl md:text-3xl font-bold text-gold">
                Kollect-It
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-ink hover:text-gold transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5 text-ink" />
            </Button>
            
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5 text-ink" />
            </Button>
            
            <Button variant="ghost" size="icon" aria-label="Shopping cart">
              <ShoppingCart className="h-5 w-5 text-ink" />
            </Button>

            <Button
              asChild
              className="bg-cta hover:bg-cta-hover text-white"
            >
              <Link href="/sell">Sell With Us</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Button variant="ghost" size="icon" aria-label="Shopping cart">
              <ShoppingCart className="h-5 w-5 text-ink" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-ink" />
              ) : (
                <Menu className="h-6 w-6 text-ink" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-ink hover:text-gold transition-colors font-medium px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="flex items-center space-x-4 px-2 pt-4 border-t border-border">
                <Button variant="ghost" size="icon" aria-label="Search">
                  <Search className="h-5 w-5 text-ink" />
                </Button>
                
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5 text-ink" />
                </Button>
              </div>

              <Button
                asChild
                className="bg-cta hover:bg-cta-hover text-white w-full"
              >
                <Link href="/sell">Sell With Us</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;

