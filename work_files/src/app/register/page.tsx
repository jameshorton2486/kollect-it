"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Check } from "lucide-react";

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

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(formData.password) },
  ];

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
        setError("Registration successful, but login failed. Please try logging in.");
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

  const handleFieldChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: undefined });
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
            <h1 className="heading-page text-lux-black">Create Account</h1>
            <p className="lead mt-3">Join Kollect-It and start collecting</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="text-label text-lux-gray-dark block mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={handleFieldChange("name")}
                placeholder="John Doe"
                className={inputClasses(!!validationErrors.name)}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-label text-lux-gray-dark block mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleFieldChange("email")}
                placeholder="your@email.com"
                className={inputClasses(!!validationErrors.email)}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="text-label text-lux-gray-dark block mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleFieldChange("password")}
                  placeholder="Create a password"
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
              {/* Password Requirements */}
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    <Check
                      className={`h-3 w-3 ${req.met ? "text-green-500" : "text-lux-gray-dark"}`}
                    />
                    <span className={req.met ? "text-green-600" : "text-lux-gray"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="text-label text-lux-gray-dark block mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleFieldChange("confirmPassword")}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-full disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-lux-charcoal/30 border-t-lux-charcoal rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-lux-silver-soft" />
            <span className="text-sm text-lux-gray">or</span>
            <div className="flex-1 h-px bg-lux-silver-soft" />
          </div>

          {/* Sign In Link */}
          <p className="text-center text-ink-600">
            Already have an account?{" "}
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
