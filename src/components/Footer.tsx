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
        {/* Main footer content */}
        <div className="grid gap-8 py-16 lg:grid-cols-[1.5fr,2.5fr]">
          {/* Brand section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                <span className="text-lux-gold group-hover:text-lux-gold-light transition-colors duration-200">Kollect</span>
                <span className="text-lux-gold group-hover:text-lux-gold-light transition-colors duration-200">-It</span>
              </h2>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-lux-cream">
              Curated antiques, art, books, militaria, and rare objects — thoughtfully photographed and authenticated.
            </p>

            {/* Contact info */}
            <div className="space-y-1 text-sm text-lux-cream">
              <p className="text-lux-gray-light">San Antonio, Texas</p>
              <a
                href="tel:+14693866065"
                className="block text-lux-cream hover:text-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
              >
                469-386-6065
              </a>
              <a
                href="mailto:info@kollect-it.com"
                className="block text-lux-cream hover:text-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
              >
                info@kollect-it.com
              </a>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 pt-2">
              <a href="mailto:info@kollect-it.com" aria-label="Email" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lux-cream hover:bg-white/20 hover:text-lux-gold-light transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lux-cream hover:bg-white/20 hover:text-lux-gold-light transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lux-cream hover:bg-white/20 hover:text-lux-gold-light transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lux-cream hover:bg-white/20 hover:text-lux-gold-light transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Right side - Links + Newsletter */}
          <div className="space-y-8">
            {/* Link columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {columnSections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-serif text-heading-sm text-lux-cream mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-lux-cream hover:text-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-lux-cream">Join the Collector&apos;s List</p>
                  <p className="text-sm text-lux-gray-light mt-0.5">Updates when new pieces arrive.</p>
                </div>
                <div className="flex gap-2 sm:w-auto">
                  <input
                    type="email"
                    placeholder="Your email"
                    aria-label="Email address for newsletter"
                    suppressHydrationWarning
                    className="h-9 flex-1 sm:w-40 rounded-full border border-white/10 bg-white/5 px-3 text-sm text-lux-cream placeholder:text-lux-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal focus:border-lux-gold transition-all"
                  />
                  <button className="h-9 rounded-full bg-lux-gold px-4 text-sm font-semibold uppercase tracking-wider text-lux-black hover:bg-lux-gold-light hover:scale-[1.02] transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Consign CTA */}
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm font-medium text-lux-cream">Have a piece to consign?</p>
                <p className="text-sm text-lux-gray-light mt-0.5">We work with collectors and estates.</p>
              </div>
              <Link
                href="/consign"
                className="rounded-full border border-lux-gold/50 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-lux-gold hover:bg-lux-gold hover:text-lux-black hover:scale-[1.02] transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal"
              >
                Start Consigning
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-lux-cream">© {year} Kollect-It. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-lux-cream hover:text-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-lux-cream hover:text-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal">
              Terms
            </Link>
            <Link href="/cookies" className="text-sm text-lux-cream hover:text-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
