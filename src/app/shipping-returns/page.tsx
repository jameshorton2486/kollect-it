import Header from '@/components/layout/Header';
import Link from 'next/link';

export const metadata = {
  title: 'Shipping & Returns',
  description: 'Shipping and returns policies for Kollect-It with secure packaging, insurance, and tracking.',
};

export default function ShippingReturnsPage() {
  return (
    <>
      <Header />
      <main className="ki-section ki-container px-4 md:px-6 lg:px-8 py-12" role="main">
        <h1 className="ki-heading-xl text-center">Shipping & Returns</h1>

        <section className="mt-12 space-y-6">
          <h2 className="ki-heading-md">Shipping</h2>
          <p className="ki-text-base">
            We handle every item with museum-quality care. Your order will be securely packaged, insured, and shipped with full tracking and delivery confirmation. Shipping times vary based on item size and destination, but most orders ship within 3–5 business days.
          </p>
        </section>

        <section className="mt-8 space-y-6">
          <h2 className="ki-heading-md">Returns & Exchanges</h2>
          <p className="ki-text-base">
            If you're not satisfied with your purchase, we accept returns within 30 days of delivery. Items must be returned in original condition with all documentation. Contact our team to begin a return or exchange.
          </p>
        </section>

        <section className="mt-12 text-center">
          <Link href="/contact" className="ki-btn-primary inline-block">Contact Support</Link>
        </section>
      </main>
      {/* Footer is rendered globally via ClientBody */}
    </>
  );
}
