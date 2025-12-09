"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, Check } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // Password strength indicators
  const passwordStrength = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(formData.password) },
    { label: "Contains uppercase", met: /[A-Z]/.test(formData.password) },
  ];

  const strengthScore = passwordStrength.filter((r) => r.met).length;
  const strengthColor =
    strengthScore === 0
      ? "bg-lux-gray-light"
      : strengthScore === 1
      ? "bg-red-400"
      : strengthScore === 2
      ? "bg-yellow-400"
      : "bg-green-500";

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Invalid or missing reset token");
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Invalid or expired token");
        }

        setTokenValid(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid or expired token");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const validateForm = () => {
    const errors: { password?: string; confirmPassword?: string } = {};

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (hasError: boolean) =>
    `w-full pl-10 pr-10 py-3 rounded-lg border transition-all ${
      hasError
        ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
        : "border-lux-silver-soft bg-lux-white text-lux-black placeholder:text-lux-gray-light focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-lux-gold"
    }`;

  // Loading state while verifying token
  if (verifying) {
    return (
      <main className="min-h-screen bg-lux-pearl flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-10 md:p-14 shadow-soft text-center">
            <div className="w-10 h-10 border-4 border-lux-gold/30 border-t-lux-gold rounded-full animate-spin mx-auto mb-6" />
            <p className="text-ink-600">Verifying reset link...</p>
          </div>
        </div>
      </main>
    );
  }

  // Invalid token state
  if (!tokenValid && !success) {
    return (
      <main className="min-h-screen bg-lux-pearl flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-10 md:p-14 shadow-soft text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="heading-section text-lux-black">Invalid Reset Link</h1>
            <p className="lead mt-4">
              {error || "This password reset link is invalid or has expired."}
            </p>
            <Link
              href="/forgot-password"
              className="btn-primary inline-flex items-center justify-center gap-2 mt-8 rounded-full"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Success state
  if (success) {
    return (
      <main className="min-h-screen bg-lux-pearl flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-10 md:p-14 shadow-soft text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="heading-section text-lux-black">Password Reset Successfully</h1>
            <p className="lead mt-4">
              Your password has been updated. Redirecting you to sign in...
            </p>
            <Link
              href="/login"
              className="btn-primary inline-flex items-center justify-center gap-2 mt-8 rounded-full"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Reset form
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
          <h1 className="heading-page text-lux-black">Create New Password</h1>
          <p className="lead mt-3">Enter your new password below.</p>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            {/* New Password */}
            <div>
              <label htmlFor="password" className="text-label text-lux-gray-dark block mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lux-gray" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: undefined });
                    }
                  }}
                  placeholder="At least 8 characters"
                  className={inputClasses(!!validationErrors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lux-gray hover:text-lux-black transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Strength Bar */}
              <div className="mt-3">
                <div className="h-1.5 bg-lux-cream rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${strengthColor}`}
                    style={{ width: `${(strengthScore / 3) * 100}%` }}
                  />
                </div>
                <div className="mt-2 space-y-1">
                  {passwordStrength.map((req) => (
                    <div key={req.label} className="flex items-center gap-2 text-xs">
                      <Check
                        className={`h-3 w-3 ${req.met ? "text-green-500" : "text-lux-gray-light"}`}
                      />
                      <span className={req.met ? "text-green-600" : "text-lux-gray"}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {validationErrors.password && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="text-label text-lux-gray-dark block mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lux-gray" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (validationErrors.confirmPassword) {
                      setValidationErrors({ ...validationErrors, confirmPassword: undefined });
                    }
                  }}
                  placeholder="Re-enter your password"
                  className={inputClasses(!!validationErrors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lux-gray hover:text-lux-black transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.confirmPassword}</p>
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
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-lux-pearl flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-10 md:p-14 shadow-soft text-center">
              <div className="w-10 h-10 border-4 border-lux-gold/30 border-t-lux-gold rounded-full animate-spin mx-auto mb-6" />
              <p className="text-ink-600">Loading...</p>
            </div>
          </div>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
