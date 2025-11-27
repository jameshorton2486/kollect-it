"use client";

import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-lux-silver/40 bg-surface-900 text-lux-ink-soft">
      <div className="container py-10 md:py-14">
        {/* Main footer content */}
        <div className="grid gap-10 py-12 md:gap-12 md:py-16 lg:grid-cols-[2fr,3fr] lg:py-20">
          {/* Brand + newsletter */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
                Kollect-It
              </h2>
              <p className="mt-3 max-w-sm text-sm text-neutral-700">
                A small, collector-run marketplace for antiques, art, books,
                militaria, and unusual finds. Every piece is hand-selected and
                described as clearly as possible.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-neutral-900">
                Join the collector&apos;s list
              </p>
              <p className="text-xs text-neutral-600">
                Occasional updates when new groups of items are listed.
              </p>
              <div className="flex max-w-sm gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="h-10 flex-1 rounded-full border border-neutral-300 bg-white px-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
                <button className="h-10 rounded-full border border-neutral-900 bg-neutral-900 px-4 text-xs font-medium uppercase tracking-wide text-white hover:bg-neutral-800">
                  Join
                </button>
              </div>
            </div>

            <div className="flex gap-4 text-neutral-500">
              <Link href="#" aria-label="Email">
                <Mail className="h-4 w-4 hover:text-neutral-800" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-4 w-4 hover:text-neutral-800" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-4 w-4 hover:text-neutral-800" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-4 w-4 hover:text-neutral-800" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-lux-silver">
                SHOP
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/browse"
                    className="text-lux-ink-soft hover:text-white"
                  >
                    Browse All
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-lux-ink-soft hover:text-white"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/category/rare-books" className="text-lux-ink-soft hover:text-white">
                    Rare Books
                  </Link>
                </li>
                <li>
                  <Link href="/category/fine-art" className="text-lux-ink-soft hover:text-white">
                    Fine Art
                  </Link>
                </li>
                <li>
                  <Link href="/category/militaria" className="text-lux-ink-soft hover:text-white">
                    Militaria
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-lux-silver">
                COMPANY
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-lux-ink-soft hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-lux-ink-soft hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/authentication" className="text-lux-ink-soft hover:text-white">
                    Authentication
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="text-lux-ink-soft hover:text-white">
                    Consign With Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-lux-ink-soft hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-lux-silver">
                SUPPORT
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-lux-ink-soft hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns" className="text-lux-ink-soft hover:text-white">
                    Shipping &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link href="/payment-options" className="text-lux-ink-soft hover:text-white">
                    Payment Options
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-lux-ink-soft hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-lux-ink-soft hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-lux-silver/30 py-4 text-xs text-lux-silver md:flex md:items-center md:justify-between">
          <p>© {year} Kollect-It. All rights reserved.</p>
          <div className="mt-2 flex gap-4 md:mt-0">
            <Link href="/privacy" className="hover:text-lux-ink-soft">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-lux-ink-soft">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-lux-ink-soft">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
