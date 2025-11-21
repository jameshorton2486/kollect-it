"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Registration successful, but login failed. Please try logging in.",
        );
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

  return (
    <main
      className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12"
      role="main"
    >
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">
            Create Account
          </h1>
          <p className="text-ink-secondary">
            Join Kollect-It and start collecting
          </p>
        </div>

        {error && (
          <div className="flex gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-ink mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (validationErrors.name) {
                  setValidationErrors({ ...validationErrors, name: undefined });
                }
              }}
              placeholder="John Doe"
              className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                validationErrors.name
                  ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                  : "border-border-neutral bg-white focus:outline-none focus:ring-2 focus:ring-cta focus:ring-opacity-50"
              }`}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>

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
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (validationErrors.email) {
                  setValidationErrors({
                    ...validationErrors,
                    email: undefined,
                  });
                }
              }}
              placeholder="your@email.com"
              className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                validationErrors.email
                  ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                  : "border-border-neutral bg-white focus:outline-none focus:ring-2 focus:ring-cta focus:ring-opacity-50"
              }`}
            />
            {validationErrors.email && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink mb-1"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
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
                placeholder="At least 6 characters"
                className={`w-full px-4 py-2 pr-10 border rounded-lg transition-colors ${
                  validationErrors.password
                    ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                    : "border-border-neutral bg-white focus:outline-none focus:ring-2 focus:ring-cta focus:ring-opacity-50"
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
            <p className="text-xs text-ink-secondary mt-1">
              Must be at least 6 characters
            </p>
            {validationErrors.password && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-ink mb-1"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (validationErrors.confirmPassword) {
                    setValidationErrors({
                      ...validationErrors,
                      confirmPassword: undefined,
                    });
                  }
                }}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-2 pr-10 border rounded-lg transition-colors ${
                  validationErrors.confirmPassword
                    ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                    : "border-border-neutral bg-white focus:outline-none focus:ring-2 focus:ring-cta focus:ring-opacity-50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-cta text-white font-medium rounded-lg hover:bg-cta/90 disabled:bg-cta/50 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border-neutral" />
          <span className="text-sm text-ink-secondary">or</span>
          <div className="flex-1 h-px bg-border-neutral" />
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-ink-secondary">
            Already have an account?{" "}
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

