"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

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
          `/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Invalid or expired token");
        }

        setTokenValid(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Invalid or expired token",
        );
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
      setError(
        err instanceof Error ? err.message : "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state while verifying token
  if (verifying) {
    return (
      <main
        className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12"
        role="main"
      >
        <div className="max-w-md mx-auto text-center">
          <div className="w-8 h-8 border-4 border-cta/30 border-t-cta rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-secondary">Verifying reset link...</p>
        </div>
      </main>
    );
  }

  // Invalid token state
  if (!tokenValid && !success) {
    return (
      <main
        className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12"
        role="main"
      >
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-ink mb-4">
            Invalid Reset Link
          </h1>
          <p className="text-ink-secondary mb-6">
            {error || "This password reset link is invalid or has expired."}
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cta text-white font-medium rounded-lg hover:bg-cta/90 transition-colors"
          >
            Request New Reset Link
          </Link>
        </div>
      </main>
    );
  }

  // Success state
  if (success) {
    return (
      <main
        className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12"
        role="main"
      >
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-ink mb-4">
            Password Reset Successfully
          </h1>
          <p className="text-ink-secondary mb-6">
            Your password has been updated. Redirecting you to sign in...
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cta text-white font-medium rounded-lg hover:bg-cta/90 transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      </main>
    );
  }

  // Reset form
  return (
    <main
      className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12"
      role="main"
    >
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
            Create New Password
          </h1>
          <p className="text-ink-secondary">Enter your new password below.</p>
        </div>

        {error && (
          <div className="flex gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink mb-1"
            >
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-secondary" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (validationErrors.password) {
                    setValidationErrors({
                      ...validationErrors,
                      password: undefined,
                    });
                  }
                }}
                placeholder="At least 8 characters"
                className={`w-full pl-10 pr-10 py-2 border rounded-lg transition-colors ${
                  validationErrors.password
                    ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                    : "border-border-neutral bg-surface-0 focus:outline-none focus:ring-2 focus:ring-cta focus:ring-opacity-50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-ink mb-1"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-secondary" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  });
                  if (validationErrors.confirmPassword) {
                    setValidationErrors({
                      ...validationErrors,
                      confirmPassword: undefined,
                    });
                  }
                }}
                placeholder="Re-enter your password"
                className={`w-full pl-10 pr-10 py-2 border rounded-lg transition-colors ${
                  validationErrors.confirmPassword
                    ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                    : "border-border-neutral bg-surface-0 focus:outline-none focus:ring-2 focus:ring-cta focus:ring-opacity-50"
                }`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.confirmPassword}
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
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main
          className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12"
          role="main"
        >
          <div className="max-w-md mx-auto text-center">
            <div className="w-8 h-8 border-4 border-cta/30 border-t-cta rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink-secondary">Loading...</p>
          </div>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
