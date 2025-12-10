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
    <div className="min-h-screen bg-lux-pearl">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-section text-lux-black mb-2">
            Admin Settings
          </h1>
          <p className="text-ink-600">
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
          <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
            <h2 className="heading-subsection text-lux-black mb-4">
              Platform Settings
            </h2>
            <div className="space-y-4">
              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-4 bg-lux-cream rounded-lg">
                <div>
                  <h3 className="font-semibold text-lux-black">Maintenance Mode</h3>
                  <p className="text-sm text-ink-600 mt-1">
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
                  <div className="w-11 h-6 bg-lux-silver-soft peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lux-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-lux-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lux-gold" />
                </label>
              </div>

              {/* Allow New Registrations */}
              <div className="flex items-center justify-between p-4 bg-lux-cream rounded-lg">
                <div>
                  <h3 className="font-semibold text-lux-black">
                    Allow New Registrations
                  </h3>
                  <p className="text-sm text-ink-600 mt-1">
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
                  <div className="w-11 h-6 bg-lux-silver-soft peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lux-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-lux-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lux-gold" />
                </label>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-lux-cream rounded-lg">
                <div>
                  <h3 className="font-semibold text-lux-black">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-ink-600 mt-1">
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
                  <div className="w-11 h-6 bg-lux-silver-soft peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lux-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-lux-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lux-gold" />
                </label>
              </div>

              {/* Auto-Approve Listings */}
              <div className="flex items-center justify-between p-4 bg-lux-cream rounded-lg">
                <div>
                  <h3 className="font-semibold text-lux-black">
                    Auto-Approve Listings
                  </h3>
                  <p className="text-sm text-ink-600 mt-1">
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
                  <div className="w-11 h-6 bg-lux-silver-soft peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lux-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-lux-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lux-gold" />
                </label>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
            <h2 className="heading-subsection text-lux-black mb-4">
              System Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-lux-silver-soft">
                <span className="text-ink-600">Application Version</span>
                <span className="font-semibold text-lux-black">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-lux-silver-soft">
                <span className="text-ink-600">Database Status</span>
                <span className="font-semibold text-emerald-600">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-ink-600">Last Backup</span>
                <span className="font-semibold text-lux-black">Today at 2:30 AM</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary rounded-full flex items-center gap-2 disabled:opacity-50"
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
              className="btn-secondary rounded-full disabled:opacity-50"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

