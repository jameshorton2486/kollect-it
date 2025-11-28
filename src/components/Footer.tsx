"use client";

import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  const columnSections = [
    {
      title: "Shop",
      links: [
        { label: "Home", href: "/" },
        { label: "Shop All", href: "/browse" },
        { label: "Browse Catalog", href: "/browse" },
        { label: "Categories", href: "/categories" },
        { label: "Product Compare", href: "/compare" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "FAQ", href: "/faq" },
        { label: "Consign With Us", href: "/sell" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Support & Policies",
      links: [
        { label: "Shipping & Returns", href: "/shipping-returns" },
        { label: "Authentication Guarantee", href: "/authentication" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];

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
              <div className="mt-4 space-y-1 text-sm text-lux-gray-dark">
                <p className="font-medium text-lux-black">Kollect-It</p>
                <p>San Antonio, Texas</p>
                <p>
                  <a
                    href="tel:+14693866065"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    469-386-6065
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:james@kollect-it.com"
                    className="text-lux-gray-dark hover:text-lux-black transition-colors"
                  >
                    james@kollect-it.com
                  </a>
                </p>
              </div>
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
            {columnSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-xs font-semibold tracking-wide text-lux-gold uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-lux-gray-dark hover:text-lux-black transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
