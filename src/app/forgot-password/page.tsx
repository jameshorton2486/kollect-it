"use client";

import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

/**
 * Forgot-password page: public reset is temporarily disabled until email (Zoho) is configured.
 * API routes remain in place for when we re-enable. Admin can reset passwords manually if needed.
 */
export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-lux-pearl flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-10 md:p-14 shadow-soft">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-lux-gray-dark hover:text-lux-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>

          <div className="w-16 h-1 bg-lux-gold mb-8" />

          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h1 className="heading-section text-lux-black">Password Reset Unavailable</h1>
              <p className="text-sm text-lux-gray-dark mt-2">
                Password reset is temporarily unavailable. Please contact support if you need help signing in.
              </p>
            </div>
          </div>

          <p className="text-center text-ink-600">
            <Link
              href="/login"
              className="font-medium text-lux-gold hover:text-lux-gold-light transition-colors"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
