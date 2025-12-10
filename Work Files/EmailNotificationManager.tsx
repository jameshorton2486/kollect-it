"use client";

import { useState } from "react";
import { 
  Mail, 
  Bell, 
  Settings, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Loader
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  lastSent?: string;
}

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: "order-confirmation",
    name: "Order Confirmation",
    subject: "Thank you for your order",
    description: "Sent when a customer completes a purchase",
  },
  {
    id: "shipping-notification",
    name: "Shipping Notification",
    subject: "Your order has shipped",
    description: "Sent when an order is marked as shipped",
  },
  {
    id: "welcome-email",
    name: "Welcome Email",
    subject: "Welcome to Kollect-It",
    description: "Sent when a new user registers",
  },
  {
    id: "password-reset",
    name: "Password Reset",
    subject: "Reset your password",
    description: "Sent when a user requests a password reset",
  },
  {
    id: "consignment-inquiry",
    name: "Consignment Inquiry Response",
    subject: "Thank you for your consignment inquiry",
    description: "Sent when responding to seller inquiries",
  },
];

const defaultSettings: NotificationSetting[] = [
  {
    id: "new-order",
    name: "New Order Notifications",
    description: "Receive email when a new order is placed",
    enabled: true,
  },
  {
    id: "low-stock",
    name: "Low Stock Alerts",
    description: "Receive alerts when inventory is low",
    enabled: true,
  },
  {
    id: "new-inquiry",
    name: "New Inquiry Notifications",
    description: "Receive email for new consignment inquiries",
    enabled: true,
  },
  {
    id: "daily-digest",
    name: "Daily Summary Digest",
    description: "Receive a daily summary of activity",
    enabled: false,
  },
];

export function EmailNotificationManager() {
  const [activeTab, setActiveTab] = useState<"templates" | "settings" | "logs">("templates");
  const [templates] = useState<EmailTemplate[]>(defaultTemplates);
  const [settings, setSettings] = useState<NotificationSetting[]>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Simulated email logs
  const [logs] = useState([
    { id: 1, template: "Order Confirmation", recipient: "customer@example.com", status: "sent", date: "2024-01-15 14:30" },
    { id: 2, template: "Welcome Email", recipient: "newuser@example.com", status: "sent", date: "2024-01-15 12:15" },
    { id: 3, template: "Shipping Notification", recipient: "buyer@example.com", status: "failed", date: "2024-01-15 10:00" },
  ]);

  const handleToggleSetting = async (settingId: string) => {
    setSaving(true);
    setError("");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    
    setSaving(false);
    setSuccess("Settings updated");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleTestEmail = async (templateId: string) => {
    setLoading(true);
    setError("");
    
    try {
      // Simulate sending test email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(`Test email sent for "${templates.find(t => t.id === templateId)?.name}"`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to send test email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-lux-black">Email Notifications</h1>
          <p className="text-lux-gray mt-1">Manage email templates and notification settings</p>
        </div>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle2 className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-lux-cream rounded-lg">
        <button
          onClick={() => setActiveTab("templates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
            activeTab === "templates"
              ? "bg-white text-lux-black shadow-sm"
              : "text-lux-gray hover:text-lux-black"
          }`}
        >
          <FileText className="w-4 h-4" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
            activeTab === "settings"
              ? "bg-white text-lux-black shadow-sm"
              : "text-lux-gray hover:text-lux-black"
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
            activeTab === "logs"
              ? "bg-white text-lux-black shadow-sm"
              : "text-lux-gray hover:text-lux-black"
          }`}
        >
          <Clock className="w-4 h-4" />
          Logs
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="grid gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-lux-charcoal/10 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-lux-cream rounded-lg">
                    <Mail className="w-5 h-5 text-lux-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lux-black">{template.name}</h3>
                    <p className="text-sm text-lux-gray mt-1">{template.description}</p>
                    <p className="text-sm text-lux-gray-light mt-2">
                      Subject: {template.subject}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTestEmail(template.id)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm border border-lux-charcoal/20 rounded-lg hover:bg-lux-cream transition disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Test
                  </button>
                  <button className="px-4 py-2 text-sm bg-lux-charcoal text-white rounded-lg hover:bg-lux-black transition">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-xl border border-lux-charcoal/10 divide-y divide-lux-charcoal/10">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-lux-cream rounded-lg">
                  <Bell className="w-5 h-5 text-lux-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-lux-black">{setting.name}</h3>
                  <p className="text-sm text-lux-gray mt-1">{setting.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting(setting.id)}
                disabled={saving}
                className={`relative w-12 h-6 rounded-full transition ${
                  setting.enabled ? "bg-lux-gold" : "bg-lux-gray-light"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    setting.enabled ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-xl border border-lux-charcoal/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-lux-cream">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-lux-black">Template</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-lux-black">Recipient</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-lux-black">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-lux-black">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lux-charcoal/10">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-lux-pearl/50">
                  <td className="px-6 py-4 text-sm text-lux-black">{log.template}</td>
                  <td className="px-6 py-4 text-sm text-lux-gray">{log.recipient}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        log.status === "sent"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.status === "sent" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-lux-gray">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmailNotificationManager;
