import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found – Kollect-It",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFoundPage() {
  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-lux-pearl to-white flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        {/* Decorative Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-surface-100">
          <svg
            className="h-10 w-10 text-lux-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Page Not Found
        </h1>

        {/* Friendly message */}
        <p className="mt-4 text-base leading-relaxed text-ink-600">
          We couldn&apos;t find that page—but we can help you find something incredible.
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/browse"
            className="inline-flex items-center justify-center rounded-full bg-lux-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lux-black shadow-sm transition-all hover:bg-lux-gold-light hover:shadow-md"
          >
            Browse Collection
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink-700 transition-colors hover:bg-surface-50"
          >
            Return Home
          </Link>
        </div>

        {/* Help text */}
        <p className="mt-8 text-sm text-ink-500">
          Looking for something specific?{" "}
          <Link href="/contact" className="text-lux-gold hover:underline underline-offset-4">
            Get in touch
          </Link>{" "}
          and we&apos;ll help you track it down.
        </p>
      </div>
    </main>
  );
}
