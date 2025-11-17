"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    emailNotifications: true,
    autoApproveListings: false,
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

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save settings" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error saving settings" });
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">
            Admin Settings
          </h1>
          <p className="text-ink-secondary">
            Configure administrative options and preferences
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Platform Settings */}
          <div className="bg-white rounded-lg border border-border-neutral p-6">
            <h2 className="text-xl font-serif font-bold text-ink mb-4">
              Platform Settings
            </h2>
            <div className="space-y-4">
              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-4 bg-surface-2 rounded-lg">
                <div>
                  <h3 className="font-semibold text-ink">Maintenance Mode</h3>
                  <p className="text-sm text-ink-secondary mt-1">
                    Temporarily disable public access to the marketplace
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    aria-label="Toggle maintenance mode"
                    checked={settings.maintenanceMode}
                    onChange={() => handleToggle("maintenanceMode")}
                    className="sr-only peer"
                    disabled={saving}
                  />
                  <div className="w-11 h-6 bg-border-neutral peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cta rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cta" />
                </label>
              </div>

              {/* Allow New Registrations */}
              <div className="flex items-center justify-between p-4 bg-surface-2 rounded-lg">
                <div>
                  <h3 className="font-semibold text-ink">
                    Allow New Registrations
                  </h3>
                  <p className="text-sm text-ink-secondary mt-1">
                    Let new users create accounts and register
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    aria-label="Toggle new registrations"
                    checked={settings.allowNewRegistrations}
                    onChange={() => handleToggle("allowNewRegistrations")}
                    className="sr-only peer"
                    disabled={saving}
                  />
                  <div className="w-11 h-6 bg-border-neutral peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cta rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cta" />
                </label>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-surface-2 rounded-lg">
                <div>
                  <h3 className="font-semibold text-ink">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-ink-secondary mt-1">
                    Send email notifications for orders and updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    aria-label="Toggle email notifications"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle("emailNotifications")}
                    className="sr-only peer"
                    disabled={saving}
                  />
                  <div className="w-11 h-6 bg-border-neutral peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cta rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cta" />
                </label>
              </div>

              {/* Auto-Approve Listings */}
              <div className="flex items-center justify-between p-4 bg-surface-2 rounded-lg">
                <div>
                  <h3 className="font-semibold text-ink">
                    Auto-Approve Listings
                  </h3>
                  <p className="text-sm text-ink-secondary mt-1">
                    Automatically publish new product listings
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    aria-label="Toggle auto-approve listings"
                    checked={settings.autoApproveListings}
                    onChange={() => handleToggle("autoApproveListings")}
                    className="sr-only peer"
                    disabled={saving}
                  />
                  <div className="w-11 h-6 bg-border-neutral peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cta rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cta" />
                </label>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-lg border border-border-neutral p-6">
            <h2 className="text-xl font-serif font-bold text-ink mb-4">
              System Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border-neutral">
                <span className="text-ink-secondary">Application Version</span>
                <span className="font-semibold text-ink">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border-neutral">
                <span className="text-ink-secondary">Database Status</span>
                <span className="font-semibold text-emerald-600">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-ink-secondary">Last Backup</span>
                <span className="font-semibold text-ink">Today at 2:30 AM</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-cta text-white rounded-lg hover:bg-cta/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving && <Loader className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Settings"}
            </button>
            <button
              onClick={() =>
                setSettings({
                  maintenanceMode: false,
                  allowNewRegistrations: true,
                  emailNotifications: true,
                  autoApproveListings: false,
                })
              }
              disabled={saving}
              className="px-6 py-3 bg-surface-2 text-ink border border-border-neutral rounded-lg hover:bg-surface-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

