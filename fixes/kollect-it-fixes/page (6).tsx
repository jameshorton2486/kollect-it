"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setValidationError("");

    const emailError = validateEmail(email);
    if (emailError) {
      setValidationError(emailError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12" role="main">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-ink mb-4">
              Check Your Email
            </h1>
            <p className="text-ink-secondary mb-6">
              If an account exists for <strong>{email}</strong>, we've sent password reset instructions to that address.
            </p>
            <p className="text-sm text-ink-secondary mb-8">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="text-link hover:text-link/80 transition-colors underline"
              >
                try again
              </button>
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-link hover:text-link/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12" role="main">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">
            Reset Password
          </h1>
          <p className="text-ink-secondary">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="flex gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink mb-1"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-secondary" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError("");
                }}
                placeholder="your@email.com"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${
                  validationError
                    ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                    : "border-border-neutral bg-surface-0 focus:outline-none focus:ring-2 focus:ring-cta focus:ring-opacity-50"
                }`}
                aria-invalid={!!validationError}
                aria-describedby={validationError ? "email-error" : undefined}
              />
            </div>
            {validationError && (
              <p id="email-error" className="text-sm text-red-600 mt-1">
                {validationError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-cta text-white font-medium rounded-lg hover:bg-cta/90 disabled:bg-cta/50 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              "Send Reset Instructions"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-ink-secondary">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-link hover:text-link/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
