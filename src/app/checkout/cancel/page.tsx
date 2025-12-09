import Link from "next/link";
import type { Metadata } from "next";
import { RotateCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Cancelled - Kollect-It",
  description: "Your payment was cancelled. Your cart items are still saved.",
};

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-[60vh] bg-lux-pearl">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-8 text-center shadow-soft sm:p-12">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lux-cream">
            <RotateCcw className="h-10 w-10 text-lux-gray-dark" />
          </div>

          {/* Heading */}
          <h1 className="heading-page text-lux-black">
            Your payment wasn&apos;t completed
          </h1>

          {/* Message */}
          <p className="lead mt-4 max-w-md mx-auto">
            No worries—your payment wasn&apos;t processed and everything in your cart is still saved. 
            Take your time deciding, or reach out if you have any questions about the pieces you&apos;re considering.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/cart"
              className="btn-primary rounded-full"
            >
              Return to Cart
            </Link>
            <Link
              href="/checkout"
              className="btn-secondary rounded-full"
            >
              Retry Checkout
            </Link>
          </div>

          {/* Secondary Link */}
          <div className="mt-6">
            <Link
              href="/browse"
              className="text-sm text-lux-gold hover:text-lux-gold-light transition-colors"
            >
              or continue browsing →
            </Link>
          </div>

          {/* Help Link */}
          <div className="mt-8 pt-8 border-t border-lux-silver-soft">
            <p className="text-sm text-ink-600">
              Having trouble?{" "}
              <Link
                href="/contact"
                className="text-lux-gold hover:underline underline-offset-4"
              >
                Contact me directly
              </Link>{" "}
              and I&apos;ll help sort it out.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
