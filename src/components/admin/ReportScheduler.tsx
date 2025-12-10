"use client";

import { useState, useEffect } from "react";

interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  recipients: string;
  format: string;
  nextScheduled: string;
  enabled: boolean;
  createdAt: string;
}

interface AuditLog {
  id: string;
  recipients: string;
  status: string;
  error?: string;
  sentAt: string;
}

/**
 * Report Scheduler Admin Component
 * Phase 5 - Manage scheduled analytics reports
 */
export default function ReportScheduler() {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ScheduledReport | null>(
    null,
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    frequency: "DAILY",
    recipients: "",
    format: "JSON",
  });

  // Load reports on mount
  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/reports");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAuditLogs(reportId: string) {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/audit`);
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data);
      }
    } catch (error) {
      console.error("Error loading audit logs:", error);
    }
  }

  async function handleCreateReport(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          frequency: "DAILY",
          recipients: "",
          format: "JSON",
        });
        setIsCreating(false);
        await loadReports();
      }
    } catch (error) {
      console.error("Error creating report:", error);
    }
  }

  async function handleDeleteReport(id: string) {
    if (!confirm("Delete this report?")) return;
    try {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await loadReports();
        setSelectedReport(null);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  }

  async function handleToggleReport(id: string, enabled: boolean) {
    try {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });

      if (response.ok) {
        await loadReports();
      }
    } catch (error) {
      console.error("Error updating report:", error);
    }
  }

  async function handleTriggerReport(id: string) {
    try {
      const response = await fetch(`/api/admin/reports/${id}/trigger`, {
        method: "POST",
      });
      if (response.ok) {
        await loadAuditLogs(id);
      }
    } catch (error) {
      console.error("Error triggering report:", error);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="heading-section text-lux-gold">Scheduled Reports</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary rounded-full"
        >
          {isCreating ? "Cancel" : "+ New Report"}
        </button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="bg-lux-charcoal p-6 rounded-xl border border-lux-gold">
          <h2 className="heading-subsection text-lux-cream mb-4">
            Create New Report
          </h2>
          <form onSubmit={handleCreateReport} className="space-y-4">
            <div>
              <label htmlFor="report-name" className="block text-sm font-medium text-label text-lux-cream mb-2">
                Report Name
              </label>
              <input
                id="report-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-lux-charcoal/80 border border-lux-gold/50 rounded-lg text-lux-cream placeholder:text-lux-gray-light focus:border-lux-gold focus:outline-none focus:ring-2 focus:ring-lux-gold"
                placeholder="e.g., Weekly Analytics"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="frequency-select" className="block text-sm font-medium text-label text-lux-cream mb-2">
                  Frequency
                </label>
                <select
                  id="frequency-select"
                  title="Report frequency"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-lux-charcoal/80 border border-lux-gold/50 rounded-lg text-lux-cream focus:border-lux-gold focus:outline-none focus:ring-2 focus:ring-lux-gold"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>

              <div>
                <label htmlFor="format-select" className="block text-sm font-medium text-label text-lux-cream mb-2">
                  Format
                </label>
                <select
                  id="format-select"
                  title="Report format"
                  value={formData.format}
                  onChange={(e) =>
                    setFormData({ ...formData, format: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-lux-charcoal/80 border border-lux-gold/50 rounded-lg text-lux-cream focus:border-lux-gold focus:outline-none focus:ring-2 focus:ring-lux-gold"
                >
                  <option value="JSON">JSON</option>
                  <option value="CSV">CSV</option>
                  <option value="HTML">HTML</option>
                </select>
              </div>

              <div>
                <label htmlFor="recipients-input" className="block text-sm font-medium text-label text-lux-cream mb-2">
                  Recipients (comma-separated)
                </label>
                <input
                  id="recipients-input"
                  type="text"
                  required
                  value={formData.recipients}
                  onChange={(e) =>
                    setFormData({ ...formData, recipients: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-lux-charcoal/80 border border-lux-gold/50 rounded-lg text-lux-cream placeholder:text-lux-gray-light focus:border-lux-gold focus:outline-none focus:ring-2 focus:ring-lux-gold"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary rounded-full w-full"
            >
              Create Report
            </button>
          </form>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        <h2 className="heading-subsection text-lux-black">Active Reports</h2>

        {loading ? (
          <div className="text-ink-600">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-ink-600">No scheduled reports yet</div>
        ) : (
          <div className="space-y-2">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => {
                  setSelectedReport(report);
                  loadAuditLogs(report.id);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedReport?.id === report.id
                    ? "bg-lux-charcoal border-lux-gold"
                    : "bg-lux-charcoal border-lux-silver-soft hover:border-lux-gold"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-lux-cream">
                      {report.name}
                    </h3>
                    <p className="text-sm text-lux-gray-light mt-1">
                      {report.frequency} • {report.format} • {report.recipients}
                    </p>
                    <p className="text-xs text-lux-gray mt-1">
                      Next: {new Date(report.nextScheduled).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerReport(report.id);
                      }}
                      className="px-3 py-1 bg-lux-gold text-lux-black text-sm rounded-full hover:bg-lux-gold-light transition"
                      aria-label={`Send report "${report.name}" now`}
                    >
                      Send Now
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleReport(report.id, report.enabled);
                      }}
                      className={`px-3 py-1 text-sm rounded-full transition ${
                        report.enabled
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-lux-charcoal/50 text-lux-cream hover:bg-lux-charcoal/80"
                      }`}
                      aria-label={`${report.enabled ? "Disable" : "Enable"} report "${report.name}"`}
                    >
                      {report.enabled ? "Enabled" : "Disabled"}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReport(report.id);
                      }}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition"
                      aria-label={`Delete report "${report.name}"`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Log */}
      {selectedReport && (
        <div className="bg-lux-charcoal p-6 rounded-xl border border-lux-gold">
          <h2 className="heading-subsection text-lux-cream mb-4">
            Audit Log - {selectedReport.name}
          </h2>

          {auditLogs.length === 0 ? (
            <div className="text-lux-gray">No audit logs yet</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg text-sm ${
                    log.status === "SUCCESS"
                      ? "bg-green-900/20 border border-green-600"
                      : log.status === "FAILED"
                        ? "bg-red-900/20 border border-red-600"
                        : "bg-lux-charcoal/50 border border-lux-silver-soft"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-lux-cream">
                      {log.status} • {log.recipients}
                    </span>
                    <span className="text-lux-gray">
                      {new Date(log.sentAt).toLocaleString()}
                    </span>
                  </div>
                  {log.error && (
                    <p className="text-red-400 mt-1 text-xs">{log.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

