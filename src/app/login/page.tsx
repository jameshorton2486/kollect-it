"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
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
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        router.push("/account");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
    if (validationErrors.email) {
      setValidationErrors({ ...validationErrors, email: undefined });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
    if (validationErrors.password) {
      setValidationErrors({ ...validationErrors, password: undefined });
    }
  };

  const inputClasses = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-lg border transition-all ${
      hasError
        ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
        : "border-lux-silver-soft bg-lux-white text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-lux-gold"
    }`;

  return (
    <main className="min-h-screen bg-lux-pearl flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-10 md:p-14 shadow-soft">
          {/* Gold Divider */}
          <div className="w-16 h-1 bg-lux-gold mx-auto mb-8" />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="heading-page text-lux-black">Welcome Back</h1>
            <p className="lead mt-3">Sign in to your Kollect-It account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="text-label text-lux-gray-dark block mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="your@email.com"
                autoComplete="email"
                className={inputClasses(!!validationErrors.email)}
                aria-invalid={validationErrors.email ? "true" : "false"}
                aria-describedby={validationErrors.email ? "email-error" : undefined}
              />
              {validationErrors.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-label text-lux-gray-dark"
                >
                  Password <span className="text-red-500">*</span>
                </label>
              </div>
              <p className="text-xs text-lux-gray-dark mb-1" aria-live="polite">
                Password reset temporarily unavailable. Contact support.
              </p>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={inputClasses(!!validationErrors.password)}
                  {...(validationErrors.password && { "aria-invalid": true })}
                  aria-describedby={validationErrors.password ? "password-error" : undefined}
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
              {validationErrors.password && (
                <p id="password-error" className="text-sm text-red-600 mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-lux-charcoal/30 border-t-lux-charcoal rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-lux-silver-soft" />
            <span className="text-sm text-lux-gray">or</span>
            <div className="flex-1 h-px bg-lux-silver-soft" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-ink-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-lux-gold hover:text-lux-gold-light transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
