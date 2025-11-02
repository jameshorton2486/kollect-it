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
    <footer className="mt-16 bg-neutral-900 text-neutral-200">
      <div className="ki-container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-16">
          {/* Logo / About intro */}
          <div>
            <div className="mb-3 font-serif text-2xl leading-none tracking-wide text-neutral-100">KOLLECT — IT</div>
            <p className="ki-text-sm leading-7 text-neutral-300">
              Timeless antiques and collectibles curated with care. Authenticity and provenance come first.
            </p>
          </div>

          {/* About + Connect */}
          <div>
            <h3 className="ki-heading-sm mb-3 text-neutral-100">About</h3>
            <ul className="space-y-2 ki-text-sm">
              <li>
                <Link className="rounded-sm transition-colors hover:text-[var(--color-muted-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-muted-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900" href="/about">Our Story</Link>
              </li>
              <li>
                <Link className="rounded-sm transition-colors hover:text-[var(--color-muted-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-muted-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900" href="/contact">Contact</Link>
              </li>
            </ul>

            <h3 className="ki-heading-sm mb-3 mt-6 text-neutral-100">Connect</h3>
            <div className="mb-1 flex items-center gap-3">
              <Link aria-label="Instagram" href="#" className="inline-flex items-center justify-center rounded border border-neutral-700 p-2 text-neutral-300 transition-colors hover:border-[var(--color-muted-gold)] hover:text-[var(--color-muted-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-muted-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900">
                <Instagram size={18} />
              </Link>
              <Link aria-label="YouTube" href="#" className="inline-flex items-center justify-center rounded border border-neutral-700 p-2 text-neutral-300 transition-colors hover:border-[var(--color-muted-gold)] hover:text-[var(--color-muted-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-muted-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900">
                <Youtube size={18} />
              </Link>
              <Link aria-label="Facebook" href="#" className="inline-flex items-center justify-center rounded border border-neutral-700 p-2 text-neutral-300 transition-colors hover:border-[var(--color-muted-gold)] hover:text-[var(--color-muted-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-muted-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900">
                <Facebook size={18} />
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="ki-heading-sm mb-3 text-neutral-100">Support</h3>
            <ul className="space-y-2 ki-text-sm">
              <li><Link className="rounded-sm transition-colors hover:text-[var(--color-muted-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-muted-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900" href="/faq">FAQ</Link></li>
              <li><Link className="rounded-sm transition-colors hover:text-[var(--color-muted-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-muted-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900" href="/shipping-returns">Shipping & Returns</Link></li>
              <li><Link className="rounded-sm transition-colors hover:text-[var(--color-muted-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-muted-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900" href="/contact">Contact Support</Link></li>
            </ul>
          </div>

          {/* Our Categories */}
          <div>
            <h3 className="ki-heading-sm mb-3 text-neutral-100">Our Categories</h3>
            <ul className="space-y-2 ki-text-sm">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link className="rounded-sm transition-colors hover:text-[var(--color-muted-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-muted-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900" href={`/category/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="ki-container px-4 md:px-6 lg:px-8 py-4 text-center">
          <p className="text-xs text-neutral-400">© {year} Kollect-It. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
