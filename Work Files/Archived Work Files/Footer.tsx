"use client";

import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  const columnSections = [
    {
      title: "Shop",
      links: [
        { label: "Shop All", href: "/browse" },
        { label: "Categories", href: "/categories" },
        { label: "Latest Arrivals", href: "/browse?sort=newest" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Our Process", href: "/our-process" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Policies",
      links: [
        { label: "Shipping & Returns", href: "/shipping-returns" },
        { label: "Authentication Guarantee", href: "/authentication" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Refund Policy", href: "/refund-policy" },
      ],
    },
  ];

  return (
    <footer className="mt-16 border-t border-white/10 bg-lux-charcoal">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content - Compact layout */}
        <div className="grid gap-8 py-10 md:py-12 lg:grid-cols-[1.5fr,2.5fr]">
          {/* Brand section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="font-serif text-xl tracking-tight">
                <span className="text-white">Kollect</span>
                <span className="text-lux-gold">-It</span>
              </h2>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-lux-gray-dark">
              Curated antiques, art, books, militaria, and rare objects — thoughtfully photographed and authenticated.
            </p>

            {/* Contact info */}
            <div className="space-y-1 text-sm text-lux-gray-dark">
              <p>San Antonio, Texas</p>
              <a
                href="tel:+14693866065"
                className="block hover:text-white transition-colors"
              >
                469-386-6065
              </a>
              <a
                href="mailto:james@kollect-it.com"
                className="block hover:text-white transition-colors"
              >
                james@kollect-it.com
              </a>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 pt-2">
              <a href="mailto:james@kollect-it.com" aria-label="Email" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lux-gray-dark hover:bg-white/20 hover:text-white transition-all">
                <Mail className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lux-gray-dark hover:bg-white/20 hover:text-white transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lux-gray-dark hover:bg-white/20 hover:text-white transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lux-gray-dark hover:bg-white/20 hover:text-white transition-all">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right side - Links + Newsletter */}
          <div className="space-y-8">
            {/* Link columns */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {columnSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-lux-gold mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-lux-gray-dark hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter - Compact */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Join the Collector&apos;s List</p>
                  <p className="text-sm text-lux-gray mt-0.5">Updates when new pieces arrive.</p>
                </div>
                <div className="flex gap-2 sm:w-auto">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="h-9 flex-1 sm:w-40 rounded-full border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-lux-gray focus:outline-none focus:ring-1 focus:ring-lux-gold/50 focus:border-lux-gold transition-all"
                  />
                  <button className="h-9 rounded-full bg-lux-gold px-4 text-sm font-semibold uppercase tracking-wider text-lux-black hover:bg-lux-gold-light transition-all whitespace-nowrap">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Consign CTA - Compact */}
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm font-medium text-white">Have a piece to consign?</p>
                <p className="text-sm text-lux-gray mt-0.5">We work with collectors and estates.</p>
              </div>
              <Link
                href="/consign"
                className="rounded-full border border-lux-gold/50 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-lux-gold hover:bg-lux-gold hover:text-lux-black transition-all whitespace-nowrap"
              >
                Start Consigning
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar - Minimal */}
        <div className="border-t border-white/10 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-lux-gray">
          <p>© {year} Kollect-It. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
