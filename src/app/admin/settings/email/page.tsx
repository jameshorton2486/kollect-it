"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface EmailStatus {
  configured: boolean;
  enabled: boolean;
  host: string;
  user: string;
  from: string;
  instructions: string;
}

export default function EmailSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || (session.user as any).role !== "admin") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  // Fetch email status
  useEffect(() => {
    fetchEmailStatus();
  }, []);

  const fetchEmailStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/email/test");
      if (response.ok) {
        const data = await response.json();
        setEmailStatus(data);
      } else {
        setMessage({ type: "error", text: "Failed to fetch email status" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error fetching email status" });
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setSending(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: data.message });
        setTestEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to send test email",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error sending test email" });
    } finally {
      setSending(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading email settings...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure and test email notifications for your store
          </p>
        </div>

        {/* Configuration Status */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Configuration Status
          </h2>

          {emailStatus && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    emailStatus.configured
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {emailStatus.configured
                    ? "✓ Configured"
                    : "⚠ Not Configured"}
                </div>
              </div>

              {/* Configuration Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SMTP Host
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {emailStatus.host}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email User
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {emailStatus.user}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    From Address
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {emailStatus.from}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enabled
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {emailStatus.enabled ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  {emailStatus.instructions}
                </p>
              </div>

              {!emailStatus.configured && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-amber-900 mb-2">
                    Setup Instructions:
                  </h3>
                  <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                    <li>Create a Google Workspace account ($6/month)</li>
                    <li>Enable 2FA on your account</li>
                    <li>
                      Generate App Password:{" "}
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-900 underline hover:text-amber-700"
                      >
                        Google App Passwords
                      </a>
                    </li>
                    <li>Add the following to your .env.local file:</li>
                  </ol>
                  <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-x-auto">
                    {`EMAIL_FROM="Kollect-It <noreply@yourdomain.com>"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="noreply@yourdomain.com"
EMAIL_PASSWORD="your-app-password"
ADMIN_EMAIL="admin@yourdomain.com"`}
                  </pre>
                  <p className="mt-2 text-sm text-amber-800">
                    5. Restart your application
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Test Email Form */}
        {emailStatus?.configured && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Send Test Email
            </h2>
            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send Test Email"}
              </button>
            </form>

            {/* Status Message */}
            {message && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            )}
          </div>
        )}

        {/* Email Templates Info */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Email Templates
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            The following email templates are configured and ready to use:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <span className="text-green-600 mr-2">✓</span>
              <strong className="mr-2">Order Confirmation:</strong>
              Sent to customers when order is placed
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <span className="text-green-600 mr-2">✓</span>
              <strong className="mr-2">Order Status Update:</strong>
              Sent when order status changes (shipped, delivered, etc.)
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <span className="text-green-600 mr-2">✓</span>
              <strong className="mr-2">Admin New Order Alert:</strong>
              Sent to admin when new order is received
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <span className="text-green-600 mr-2">✓</span>
              <strong className="mr-2">Welcome Email:</strong>
              Sent to new users on registration
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

