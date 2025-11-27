"use client";

import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-lux-silver bg-lux-pearl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid gap-10 py-12 md:gap-12 md:py-16 lg:grid-cols-[2fr,3fr] lg:py-20">
          {/* Brand + newsletter */}
          <div className="space-y-6">
            <div>
              <Link href="/" className="inline-block">
                <h2 className="text-lg font-serif md:text-xl">
                  <span className="text-lux-black">Kollect</span>
                  <span className="text-lux-gold">-It</span>
                </h2>
              </Link>
              <p className="mt-3 max-w-sm text-sm text-lux-gray-dark leading-relaxed">
                A small, collector-run marketplace for antiques, art, books,
                militaria, and unusual finds. Every piece is hand-selected and
                described as clearly as possible.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-lux-black">
                Join the collector&apos;s list
              </p>
              <p className="text-xs text-lux-gray">
                Occasional updates when new groups of items are listed.
              </p>
              <div className="flex max-w-sm gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="h-10 flex-1 rounded-full border border-lux-silver bg-lux-white px-4 text-sm text-lux-black shadow-sm focus:outline-none focus:ring-2 focus:ring-lux-gold/30 focus:border-lux-gold transition-all"
                />
                <button className="h-10 rounded-full bg-lux-black px-5 text-xs font-medium uppercase tracking-wide text-lux-white hover:bg-lux-charcoal hover:border-lux-gold border border-lux-black transition-all">
                  Join
                </button>
              </div>
            </div>

            <div className="flex gap-4 text-lux-gray">
              <Link href="#" aria-label="Email" className="hover:text-lux-gold transition-colors">
                <Mail className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="Instagram" className="hover:text-lux-gold transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="Facebook" className="hover:text-lux-gold transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="Twitter" className="hover:text-lux-gold transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-lux-gold uppercase">
                Shop
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/shop"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Browse All
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/rare-books"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Rare Books
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/fine-art"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Fine Art
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/militaria"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Militaria
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-lux-gold uppercase">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/authentication"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Authentication
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sell"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Sell With Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-lux-gold uppercase">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faq"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-returns"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Shipping &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/payment-options"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Payment Options
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-lux-silver py-4 text-xs text-lux-gray md:flex md:items-center md:justify-between">
          <p>© {year} Kollect-It. All rights reserved.</p>
          <div className="mt-2 flex gap-4 md:mt-0">
            <Link href="/privacy" className="hover:text-lux-gold transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-lux-gold transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-lux-gold transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
