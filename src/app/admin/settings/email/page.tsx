"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader, Mail } from "lucide-react";

export default function AdminEmailSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    smtpFrom: "",
    enableEmailNotifications: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    if (status === "unauthenticated") router.push("/admin/login");
    return null;
  }

  const handleInputChange = (key: keyof typeof emailSettings, value: string | number | boolean) => {
    setEmailSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/settings/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailSettings),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Email settings saved successfully!" });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save email settings. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-gray-400 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Email Settings</h1>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Configure SMTP settings and email notifications for your marketplace.
            </p>
          </div>

          <div className="px-6 py-6">
            {message && (
              <div className={`mb-6 p-4 rounded-md ${message.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div className="flex">
                  {message.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${message.type === "success" ? "text-green-800" : "text-red-800"}`}>
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">SMTP Configuration</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => handleInputChange("smtpHost", e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => handleInputChange("smtpPort", parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      id="smtpUser"
                      value={emailSettings.smtpUser}
                      onChange={(e) => handleInputChange("smtpUser", e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="your-email@gmail.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      id="smtpPassword"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => handleInputChange("smtpPassword", e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="smtpFrom" className="block text-sm font-medium text-gray-700">
                      From Email Address
                    </label>
                    <input
                      type="email"
                      id="smtpFrom"
                      value={emailSettings.smtpFrom}
                      onChange={(e) => handleInputChange("smtpFrom", e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="noreply@yourdomain.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="flex items-center">
                  <input
                    id="enableEmailNotifications"
                    type="checkbox"
                    checked={emailSettings.enableEmailNotifications}
                    onChange={(e) => handleInputChange("enableEmailNotifications", e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableEmailNotifications" className="ml-2 block text-sm text-gray-900">
                    Enable email notifications for admin actions
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving && <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
