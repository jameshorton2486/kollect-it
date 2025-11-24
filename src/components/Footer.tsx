"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

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
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: "mailto:hello@kollect-it.com", icon: Mail, label: "Email" },
  ];

  return (
    <footer className="bg-lux-carbon text-lux-gray-light">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-logo text-2xl text-lux-white">
                Kollect
              </span>
              <span className="font-logo text-2xl text-lux-gold">
                -It
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

