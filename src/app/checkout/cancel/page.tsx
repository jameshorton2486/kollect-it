import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled - Kollect-It",
  description: "Your payment was cancelled. Your cart items are still saved.",
};

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-[60vh] bg-lux-pearl">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="rounded-2xl border border-border-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-100">
            <svg className="h-8 w-8 text-ink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Payment Cancelled</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-600">No worries - your payment was not processed and your cart items are still saved.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/cart" className="inline-flex items-center justify-center rounded-full bg-lux-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lux-black">Return to Cart</Link>
            <Link href="/browse" className="inline-flex items-center justify-center rounded-full border border-border-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink-700">Continue Browsing</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

