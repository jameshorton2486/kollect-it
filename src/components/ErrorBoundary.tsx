"use client";

import { useEffect } from "react";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Application error:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-50">
      <div className="max-w-md w-full bg-surface-0 rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-3xl font-serif text-navy mb-3">
          Something Went Wrong
        </h1>

        <p className="text-ink-600 mb-6">
          We apologize for the inconvenience. Our team has been notified and is
          working to resolve the issue.
        </p>

        {error.digest && (
          <div className="bg-surface-100 rounded p-3 mb-6">
            <p className="text-xs text-ink-700 font-mono">
              Error ID: {error.digest}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 px-6 py-3 border-2 border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

