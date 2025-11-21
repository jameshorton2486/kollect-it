"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  const navigation = {
    shop: [
      { name: "Browse All", href: "/shop" },
      { name: "Rare Books", href: "/category/rare-books" },
      { name: "Fine Art", href: "/category/fine-art" },
      { name: "Militaria", href: "/category/militaria" },
      { name: "Collectibles", href: "/category/collectibles" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Authentication", href: "/authentication" },
      { name: "Sell With Us", href: "/sell" },
      { name: "Contact", href: "/contact" },
    ],
    support: [
      { name: "FAQ", href: "/faq" },
      { name: "Shipping & Returns", href: "/shipping-returns" },
      { name: "Payment Options", href: "/payment" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-surface-1 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-3xl font-bold text-gold">
                Kollect-It
              </span>
            </Link>
            <p className="text-ink/70 text-sm leading-relaxed mb-6">
              Your trusted marketplace for authenticated luxury collectibles and antiques.
              Expert curation, transparent pricing, professional service.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:info@kollect-it.com"
                className="text-ink hover:text-gold transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-serif text-ink font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              {navigation.shop.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-ink/70 hover:text-gold transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-serif text-ink font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-ink/70 hover:text-gold transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-serif text-ink font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-ink/70 hover:text-gold transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-ink/60 text-sm">
              © {new Date().getFullYear()} Kollect-It. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/privacy"
                className="text-ink/60 hover:text-gold transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-ink/60 hover:text-gold transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-ink/60 hover:text-gold transition-colors text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

