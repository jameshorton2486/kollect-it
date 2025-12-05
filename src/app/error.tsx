"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-lux-pearl to-white flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        {/* Decorative Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-10 w-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Something went wrong—please try again
        </h1>

        {/* Friendly message */}
        <p className="mt-4 text-base leading-relaxed text-ink-600">
          I&apos;m sorry—something unexpected happened. Please try again, or return to browsing. If this keeps happening, let me know and I&apos;ll help sort it out.
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full bg-lux-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lux-black shadow-sm transition-all hover:bg-lux-gold-light hover:shadow-md"
          >
            Try Again
          </button>
          <Link
            href="/browse"
            className="inline-flex items-center justify-center rounded-full border border-border-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink-700 transition-colors hover:bg-surface-50"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Help text */}
        <p className="mt-8 text-sm text-ink-700">
          If this keeps happening,{" "}
          <Link href="/contact" className="text-lux-gold hover:underline underline-offset-4">
            let me know
          </Link>{" "}
          and I&apos;ll help sort it out.
        </p>
      </div>
    </main>
  );
}
