"use client";

/**
 * Email Notification Manager Component
 * Phase 6 Step 7 - Email notifications and automated campaigns
 */

import { useState, useEffect } from "react";
import {
  Mail,
  Send,
  CheckCircle,
  XCircle,
  Package,
  DollarSign,
  AlertCircle,
  Edit,
  Trash2,
  Play,
  Pause,
  Plus,
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type:
    | "order_confirmation"
    | "shipping_update"
    | "promotion"
    | "abandoned_cart"
    | "custom";
  status: "active" | "draft" | "paused";
  content: string;
  recipients: number;
  lastSent?: string;
  openRate?: number;
  clickRate?: number;
}

interface EmailCampaign {
  id: string;
  name: string;
  template: string;
  status: "scheduled" | "sending" | "sent" | "failed";
  scheduledFor?: string;
  sentAt?: string;
  totalRecipients: number;
  sent: number;
  opened: number;
  clicked: number;
}

interface EmailStats {
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  bounceRate: number;
}

export function EmailNotificationManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [activeTab, setActiveTab] = useState<
    "templates" | "campaigns" | "stats"
  >("templates");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [templatesRes, campaignsRes, statsRes] = await Promise.all([
        fetch("/api/admin/email/templates"),
        fetch("/api/admin/email/campaigns"),
        fetch("/api/admin/email/stats"),
      ]);

      const [templatesData, campaignsData, statsData] = await Promise.all([
        templatesRes.json(),
        campaignsRes.json(),
        statsRes.json(),
      ]);

      setTemplates(templatesData);
      setCampaigns(campaignsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching email data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateAction = async (
    templateId: string,
    action: "activate" | "pause" | "delete",
  ) => {
    try {
      if (action === "delete") {
        await fetch(`/api/admin/email/templates/${templateId}`, {
          method: "DELETE",
        });
      } else {
        await fetch(`/api/admin/email/templates/${templateId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: action === "activate" ? "active" : "paused",
          }),
        });
      }
      fetchData();
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case "order_confirmation":
        return <Package className="w-5 h-5" />;
      case "shipping_update":
        return <Send className="w-5 h-5" />;
      case "promotion":
        return <DollarSign className="w-5 h-5" />;
      case "abandoned_cart":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-800",
      paused: "bg-yellow-100 text-yellow-800",
      scheduled: "bg-blue-100 text-blue-800",
      sending: "bg-purple-100 text-purple-800",
      sent: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading email system...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Notifications</h2>
        <button
          onClick={() => {/* TODO: Implement template editor */}}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Sent</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.totalSent.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Avg. Open Rate
                </p>
                <p className="text-3xl font-bold mt-2">{stats.avgOpenRate}%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Avg. Click Rate
                </p>
                <p className="text-3xl font-bold mt-2">{stats.avgClickRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Bounce Rate</p>
                <p className="text-3xl font-bold mt-2">{stats.bounceRate}%</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("templates")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "templates"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Templates ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "campaigns"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "stats"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Statistics
          </button>
        </nav>
      </div>

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Sent
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-blue-600 mr-3">
                          {getTemplateIcon(template.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {template.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {template.subject}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {template.type
                          .replace("_", " ")
                          .split(" ")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(template.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {template.openRate !== undefined && (
                        <div className="text-sm">
                          <div className="text-gray-900">
                            Open: {template.openRate}%
                          </div>
                          <div className="text-gray-500">
                            Click: {template.clickRate}%
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {template.lastSent
                        ? new Date(template.lastSent).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {/* TODO: Implement template editing */}}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label="Edit template"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {template.status === "active" ? (
                          <button
                            onClick={() =>
                              handleTemplateAction(template.id, "pause")
                            }
                            className="text-yellow-600 hover:text-yellow-900"
                            aria-label="Pause template"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleTemplateAction(template.id, "activate")
                            }
                            className="text-green-600 hover:text-green-900"
                            aria-label="Activate template"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleTemplateAction(template.id, "delete")
                          }
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opened
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {campaign.template}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.totalRecipients.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {campaign.sent.toLocaleString()}
                        </div>
                        <div className="ml-2 text-xs text-gray-500">
                          (
                          {Math.round(
                            (campaign.sent / campaign.totalRecipients) * 100,
                          )}
                          %)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {campaign.opened.toLocaleString()}
                        </div>
                        <div className="ml-2 text-xs text-gray-500">
                          (
                          {campaign.sent > 0
                            ? Math.round(
                                (campaign.opened / campaign.sent) * 100,
                              )
                            : 0}
                          %)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {campaign.clicked.toLocaleString()}
                        </div>
                        <div className="ml-2 text-xs text-gray-500">
                          (
                          {campaign.sent > 0
                            ? Math.round(
                                (campaign.clicked / campaign.sent) * 100,
                              )
                            : 0}
                          %)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.sentAt
                        ? new Date(campaign.sentAt).toLocaleDateString()
                        : campaign.scheduledFor
                          ? `Scheduled: ${new Date(campaign.scheduledFor).toLocaleDateString()}`
                          : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === "stats" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Email Performance Analytics
          </h3>
          <div className="text-gray-500">
            Detailed analytics charts and reports coming soon...
          </div>
        </div>
      )}
    </div>
  );
}

