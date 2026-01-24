"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (process.env.NODE_ENV === "development") {
      console.log("🔐 Login attempt started", { email, hasPassword: !!password });
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("🔐 SignIn result:", result);
      }

      if (result?.error) {
        if (process.env.NODE_ENV === "development") {
          console.error("🔐 Login failed:", result.error);
        }
        setError("Invalid email or password");
      } else if (result?.ok) {
        if (process.env.NODE_ENV === "development") {
          console.log("🔐 Login succeeded, redirecting to dashboard");
        }
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        if (process.env.NODE_ENV === "development") {
          console.warn("🔐 Unexpected signIn result:", result);
        }
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error("🔐 Login exception:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lux-pearl px-4">
      <div className="w-full max-w-md">
        <div className="bg-lux-white rounded-2xl border border-lux-silver-soft shadow-clean p-8">
          <div className="text-center mb-8">
            <h1 className="heading-page text-lux-black mb-2">
              Kollect-It Admin
            </h1>
            <p className="text-ink-600">Sign in to manage your inventory</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent transition"
                placeholder="admin@kollect-it.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary rounded-full w-full disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-lux-gray">
            <p>Use your Kollect-It admin email and password.</p>
            <p className="mt-1 text-xs">
              Example: <span className="font-mono">admin@kollect-it.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
