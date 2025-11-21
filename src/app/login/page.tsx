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
    } catch (err) {
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

  return (
    <main
      className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12"
      role="main"
    >
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">
            Welcome Back
          </h1>
          <p className="text-ink-secondary">
            Sign in to your Kollect-It account
          </p>
        </div>

        {error && (
          <div className="flex gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink mb-1"
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
              className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                validationErrors.email
                  ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                  : "border-border-neutral bg-surface-0 focus:outline-none focus:ring-2 focus:ring-cta focus:ring-opacity-50"
              }`}
              {...(validationErrors.email
                ? { "aria-invalid": true, "aria-describedby": "email-error" }
                : {})}
            />
            {validationErrors.email && (
              <p id="email-error" className="text-sm text-red-600 mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-link hover:text-link/80 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 pr-10 border rounded-lg transition-colors ${
                  validationErrors.password
                    ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                    : "border-border-neutral bg-surface-0 focus:outline-none focus:ring-2 focus:ring-cta focus:ring-opacity-50"
                }`}
                {...(validationErrors.password
                  ? {
                      "aria-invalid": true,
                      "aria-describedby": "password-error",
                    }
                  : {})}
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
              <p id="password-error" className="text-sm text-red-600 mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-cta text-white font-medium rounded-lg hover:bg-cta/90 disabled:bg-cta/50 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border-neutral" />
          <span className="text-sm text-ink-secondary">or</span>
          <div className="flex-1 h-px bg-border-neutral" />
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-ink-secondary">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-link hover:text-link/80 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

