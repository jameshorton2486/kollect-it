"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * DIAGNOSTIC HEADER - Simple version for troubleshooting
 * If this doesn't show up, the problem is with your CSS files or dev server
 * If this DOES show up, the problem was with the Button component
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Browse", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface-50 border-b border-border-300">
      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="font-serif text-3xl font-bold text-ink-900">
                Kollect<span className="text-gold-600">-It</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-ink-600 hover:text-gold-600 uppercase"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions - Simple buttons without Button component */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/sell"
              className="inline-flex items-center justify-center px-6 py-2 bg-cta-600 hover:bg-cta-700 text-white font-medium rounded-full transition-colors"
            >
              Sell Item
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink-900"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-300">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-2 py-3 text-ink-800 hover:text-gold-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <a
                href="/sell"
                className="mt-4 inline-flex items-center justify-center px-6 py-3 bg-cta-600 text-white font-medium rounded-lg"
              >
                Sell With Us
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
