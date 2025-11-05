import Link from 'next/link';
import { Instagram, Youtube, Facebook } from 'lucide-react';

interface FooterProps {
  categories?: Array<{ id?: string; name: string; slug: string }>; // optional override
}

export default function Footer({ categories }: FooterProps) {
  const year = new Date().getFullYear();
  const defaultCategories = [
    { name: 'Fine Art', slug: 'fine-art' },
    { name: 'Antique Books', slug: 'antique-books' },
    { name: 'Collectibles', slug: 'collectibles' },
    { name: 'Militaria', slug: 'militaria' },
  ];
  const cats = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <footer className="bg-neutral-900 text-neutral-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="font-serif text-2xl leading-tight tracking-wide text-neutral-100 mb-4">
              KOLLECT—IT
            </div>
            <p className="text-sm leading-relaxed text-neutral-300 mb-3">
              Timeless antiques and collectibles curated with care.
            </p>
            <p className="text-sm leading-relaxed text-neutral-400">
              Authenticity and provenance come first.
            </p>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-neutral-100">About</h3>
            <ul className="space-y-3 text-left">
              <li>
                <Link 
                  href="/about"
                  className="text-sm text-neutral-300 transition-colors hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="text-sm text-neutral-300 transition-colors hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-neutral-100">Support</h3>
            <ul className="space-y-3 text-left">
              <li>
                <Link 
                  href="/faq"
                  className="text-sm text-neutral-300 transition-colors hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping-returns"
                  className="text-sm text-neutral-300 transition-colors hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="text-sm text-neutral-300 transition-colors hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Categories Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-neutral-100">Our Categories</h3>
            <ul className="space-y-3 text-left">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link 
                    href={`/category/${c.slug}`}
                    className="text-sm text-neutral-300 transition-colors hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Connect Section */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <h3 className="text-lg font-semibold mb-6 text-neutral-100 text-left">Connect</h3>
          <div className="flex gap-4 justify-start">
            <Link 
              aria-label="Instagram"
              href="#"
              className="inline-flex items-center justify-center rounded border border-neutral-700 p-3 text-neutral-300 transition-all hover:border-amber-600 hover:text-amber-600 hover:bg-neutral-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              <Instagram size={20} />
            </Link>
            <Link 
              aria-label="YouTube"
              href="#"
              className="inline-flex items-center justify-center rounded border border-neutral-700 p-3 text-neutral-300 transition-all hover:border-amber-600 hover:text-amber-600 hover:bg-neutral-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              <Youtube size={20} />
            </Link>
            <Link 
              aria-label="Facebook"
              href="#"
              className="inline-flex items-center justify-center rounded border border-neutral-700 p-3 text-neutral-300 transition-all hover:border-amber-600 hover:text-amber-600 hover:bg-neutral-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              <Facebook size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-8">
          <p className="text-xs text-neutral-500 text-left md:text-center">
            © {year} Kollect-It. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
