"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail } from "lucide-react";
import { FaPinterest } from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { href: "/shop", label: "Browse All" },
      { href: "/categories", label: "Categories" },
      { href: "/category/rare-books", label: "Rare Books" },
      { href: "/category/fine-art", label: "Fine Art" },
      { href: "/category/militaria", label: "Militaria" },
    ],
    company: [
      { href: "/about", label: "About Us" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/authentication", label: "Authentication" },
      { href: "/sell", label: "Sell With Us" },
      { href: "/contact", label: "Contact" },
    ],
    support: [
      { href: "/faq", label: "FAQ" },
      { href: "/shipping-returns", label: "Shipping & Returns" },
      { href: "/payment", label: "Payment Options" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  };

  const socialLinks = [
    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://pinterest.com", icon: FaPinterest, label: "Pinterest" },
    { href: "mailto:hello@kollect-it.com", icon: Mail, label: "Email" },
  ];

  return (
    <footer className="bg-lux-carbon text-lux-gray-light">
      {/* Main Footer Content */}
      <div className="container mx-auto page-padding section-normal">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-hero lg:gap-luxury">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-logo text-2xl text-lux-white">
                Kollect
              </span>
              <span className="font-logo text-2xl text-lux-gold">-It</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              A trusted marketplace for authenticated antiques and collectibles.
              Every piece tells a story worth preserving.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-lux-white mb-3">
                Join the Collector's List
              </h4>
              <p className="text-xs text-lux-gray-light mb-3">
                Get notified of new arrivals first
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-lux-charcoal text-lux-white border border-lux-charcoal rounded focus:outline-none focus:border-lux-gold transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-lux-gold text-lux-black text-sm font-medium rounded hover:bg-lux-gold-light transition-colors"
                >
                  Join
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-lux-gray-light hover:text-lux-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-xs font-semibold text-lux-gold uppercase tracking-widest mb-6">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-lux-gray-light hover:text-lux-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-xs font-semibold text-lux-gold uppercase tracking-widest mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-lux-gray-light hover:text-lux-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-xs font-semibold text-lux-gold uppercase tracking-widest mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-lux-gray-light hover:text-lux-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-lux-charcoal">
        <div className="container mx-auto page-padding py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-lux-gray">
              © {currentYear} Kollect-It. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="text-xs text-lux-gray hover:text-lux-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-lux-gray hover:text-lux-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-lux-gray hover:text-lux-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

