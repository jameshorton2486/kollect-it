"use client";

import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
              <h3 className="text-xs font-semibold tracking-wide text-neutral-500">
                SHOP
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/browse"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Browse All
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/rare-books"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Rare Books
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/fine-art"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Fine Art
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/militaria"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Militaria
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-neutral-500">
                COMPANY
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/authentication"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Authentication
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sell"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Consign With Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-neutral-500">
                SUPPORT
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faq"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-returns"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Shipping &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/payment-options"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Payment Options
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-200 py-4 text-xs text-neutral-500 md:flex md:items-center md:justify-between">
          <p>© {year} Kollect-It. All rights reserved.</p>
          <div className="mt-2 flex gap-4 md:mt-0">
            <Link href="/privacy" className="hover:text-neutral-800">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-800">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-neutral-800">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
