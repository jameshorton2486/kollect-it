"use client";

/**
 * Automated Sales Reports Component
 * Phase 6 Step 4 - Schedule and generate automated sales reports
 */

import { useState } from "react";
import {
  Calendar,
  Clock,
  Mail,
  Download,
  FileText,
  TrendingUp,
} from "lucide-react";

interface ReportSchedule {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  recipients: string[];
  format: "csv" | "pdf" | "excel";
  includeCharts: boolean;
  active: boolean;
  lastRun: string | null;
  nextRun: string;
}

interface Props {
  schedules: ReportSchedule[];
  onSchedule: (
    schedule: Omit<ReportSchedule, "id" | "lastRun" | "nextRun">,
  ) => void;
  onGenerate: (type: string) => void;
}

export function AutomatedReports({ schedules, onSchedule, onGenerate }: Props) {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    frequency: "weekly" as "daily" | "weekly" | "monthly",
    recipients: "",
    format: "pdf" as "csv" | "pdf" | "excel",
    includeCharts: true,
    active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipientList = formData.recipients
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    onSchedule({
      ...formData,
      recipients: recipientList,
    });

    // Reset form
    setFormData({
      name: "",
      frequency: "weekly",
      recipients: "",
      format: "pdf",
      includeCharts: true,
      active: true,
    });
    setShowScheduleForm(false);
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      default:
        return frequency;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Generate Reports */}
      <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
        <h2 className="heading-subsection text-lux-black mb-4">
          Generate Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onGenerate("daily-summary")}
            className="flex flex-col items-center gap-3 p-4 border-2 border-lux-silver-soft rounded-xl hover:border-lux-gold hover:bg-lux-cream transition"
          >
            <Calendar className="text-lux-gold" size={32} />
            <div className="text-center">
              <div className="font-medium text-lux-black">Daily Summary</div>
              <div className="text-xs text-ink-600 mt-1">
                Today's orders & revenue
              </div>
            </div>
          </button>

          <button
            onClick={() => onGenerate("weekly-summary")}
            className="flex flex-col items-center gap-3 p-4 border-2 border-lux-silver-soft rounded-xl hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <TrendingUp className="text-blue-600" size={32} />
            <div className="text-center">
              <div className="font-medium text-lux-black">Weekly Report</div>
              <div className="text-xs text-ink-600 mt-1">
                Last 7 days analysis
              </div>
            </div>
          </button>

          <button
            onClick={() => onGenerate("monthly-summary")}
            className="flex flex-col items-center gap-3 p-4 border-2 border-lux-silver-soft rounded-xl hover:border-purple-500 hover:bg-purple-50 transition"
          >
            <FileText className="text-purple-600" size={32} />
            <div className="text-center">
              <div className="font-medium text-lux-black">Monthly Report</div>
              <div className="text-xs text-ink-600 mt-1">
                Full month breakdown
              </div>
            </div>
          </button>

          <button
            onClick={() => onGenerate("custom")}
            className="flex flex-col items-center gap-3 p-4 border-2 border-lux-silver-soft rounded-xl hover:border-green-500 hover:bg-green-50 transition"
          >
            <Clock className="text-green-600" size={32} />
            <div className="text-center">
              <div className="font-medium text-lux-black">Custom Range</div>
              <div className="text-xs text-ink-600 mt-1">
                Choose date range
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-subsection text-lux-black">
            Scheduled Reports
          </h2>
          <button
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="btn-primary rounded-full text-sm"
          >
            {showScheduleForm ? "Cancel" : "+ New Schedule"}
          </button>
        </div>

        {/* Schedule Form */}
        {showScheduleForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-4 bg-lux-cream rounded-xl border border-lux-silver-soft"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="report-name"
                  className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
                >
                  Report Name
                </label>
                <input
                  id="report-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Weekly Sales Report"
                  className="w-full px-3 py-2 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="frequency-select"
                  className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
                >
                  Frequency
                </label>
                <select
                  id="frequency-select"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frequency: e.target.value as
                        | "daily"
                        | "weekly"
                        | "monthly",
                    })
                  }
                  className="w-full px-3 py-2 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="recipients"
                  className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
                >
                  Recipients (comma-separated)
                </label>
                <input
                  id="recipients"
                  type="text"
                  value={formData.recipients}
                  onChange={(e) =>
                    setFormData({ ...formData, recipients: e.target.value })
                  }
                  placeholder="admin@example.com, manager@example.com"
                  className="w-full px-3 py-2 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="format-select"
                  className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
                >
                  Format
                </label>
                <select
                  id="format-select"
                  value={formData.format}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      format: e.target.value as "csv" | "pdf" | "excel",
                    })
                  }
                  className="w-full px-3 py-2 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeCharts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      includeCharts: e.target.checked,
                    })
                  }
                  className="rounded text-lux-gold border-lux-silver-soft focus:ring-lux-gold"
                />
                <span className="text-sm text-ink-600">
                  Include charts and visualizations
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 w-full btn-primary rounded-full"
            >
              Create Schedule
            </button>
          </form>
        )}

        {/* Schedules List */}
        {schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-4 border border-lux-silver-soft rounded-xl hover:bg-lux-cream transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-lux-black">
                      {schedule.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        schedule.active
                          ? "bg-green-100 text-green-800"
                          : "bg-lux-cream text-ink-600"
                      }`}
                    >
                      {schedule.active ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-ink-600">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{getFrequencyLabel(schedule.frequency)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <span>{schedule.recipients.length} recipient(s)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={14} />
                      <span className="uppercase">{schedule.format}</span>
                    </div>
                  </div>
                  {schedule.nextRun && (
                    <div className="mt-1 text-xs text-lux-gray">
                      Next run: {new Date(schedule.nextRun).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-ink-600 hover:text-lux-gold hover:bg-lux-cream rounded-lg transition-colors"
                    aria-label="Download report"
                    title="Download report"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-ink-600">
            <FileText size={48} className="mx-auto mb-3 text-lux-gray-dark" />
            <p>No scheduled reports yet</p>
            <p className="text-sm mt-1">
              Create your first automated report schedule
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
