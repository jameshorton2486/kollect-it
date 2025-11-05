'use client'

import Link from 'next/link'
import { Instagram, Youtube, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-36">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="font-serif text-2xl leading-tight tracking-wide text-[#D3AF37] mb-4">
              KOLLECT—IT
            </div>
            <p className="text-white text-sm leading-relaxed">
              Timeless antiques and collectibles curated with care.
            </p>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">About</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-white hover:text-[#D3AF37] transition-colors duration-200 text-sm"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-white hover:text-[#D3AF37] transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/faq" 
                  className="text-white hover:text-[#D3AF37] transition-colors duration-200 text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping-returns" 
                  className="text-white hover:text-[#D3AF37] transition-colors duration-200 text-sm"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-white hover:text-[#D3AF37] transition-colors duration-200 text-sm"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Section */}
          <div className="pr-24">
            <h3 className="text-lg font-semibold mb-6 text-white">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/category/fine-art" 
                  className="text-white hover:text-[#D3AF37] transition-colors duration-200 text-sm"
                >
                  Fine Art
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/antiques" 
                  className="text-white hover:text-[#D3AF37] transition-colors duration-200 text-sm"
                >
                  Antiques
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/collectibles" 
                  className="text-white hover:text-[#D3AF37] transition-colors duration-200 text-sm"
                >
                  Collectibles
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/militaria" 
                  className="text-white hover:text-[#D3AF37] transition-colors duration-200 text-sm"
                >
                  Militaria
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Connect Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/kollectit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border-2 border-gray-600 rounded-lg hover:border-[#D3AF37] transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://youtube.com/kollectit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border-2 border-gray-600 rounded-lg hover:border-[#D3AF37] transition-colors duration-200"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://facebook.com/kollectit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border-2 border-gray-600 rounded-lg hover:border-[#D3AF37] transition-colors duration-200"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-8">
          <p className="text-sm text-white text-center md:text-left">
            © 2025 Kollect-It. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}