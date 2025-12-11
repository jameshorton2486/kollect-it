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
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (hasError: boolean) =>
    `w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
      hasError
        ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
        : "border-lux-silver-soft bg-lux-white text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-lux-gold"
    }`;

  // Success State
  if (success) {
    return (
      <main className="min-h-screen bg-lux-pearl flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-10 md:p-14 shadow-soft text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="heading-section text-lux-black">Check Your Email</h1>
            <p className="lead mt-4">
              If an account exists for <strong className="text-lux-black">{email}</strong>,
              we&apos;ve sent password reset instructions to that address.
            </p>
            <p className="text-muted mt-4">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="text-lux-gold hover:text-lux-gold-light transition-colors underline"
              >
                try again
              </button>
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-lux-gold hover:text-lux-gold-light transition-colors mt-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Form State
  return (
    <main className="min-h-screen bg-lux-pearl flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-10 md:p-14 shadow-soft">
          {/* Back Link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-lux-gray-dark hover:text-lux-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>

          {/* Gold Divider */}
          <div className="w-16 h-1 bg-lux-gold mb-8" />

          {/* Header */}
          <h1 className="heading-page text-lux-black">Reset Password</h1>
          <p className="lead mt-3">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="text-label text-lux-gray-dark block mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lux-gray" />
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
                  className={inputClasses(!!validationError)}
                  aria-invalid={validationError ? "true" : "false"}
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
              className="btn-primary w-full rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-lux-charcoal/30 border-t-lux-charcoal rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-ink-600 mt-8">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-lux-gold hover:text-lux-gold-light transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
