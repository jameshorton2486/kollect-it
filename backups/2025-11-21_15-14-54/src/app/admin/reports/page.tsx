"use client";

/**
 * Admin Reports Page
 * Phase 6 Step 4 - Enhanced automated reporting system
 */

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AutomatedReports } from "@/components/admin/AutomatedReports";
import ReportScheduler from "@/components/admin/ReportScheduler";

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

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schedules, setSchedules] = useState<ReportSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (
      status === "authenticated" &&
      (session?.user as any)?.role !== "admin"
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      (session?.user as any)?.role === "admin"
    ) {
      fetchSchedules();
    }
  }, [status, session]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/admin/reports/schedules");
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error("Error fetching report schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (
    schedule: Omit<ReportSchedule, "id" | "lastRun" | "nextRun">,
  ) => {
    try {
      const response = await fetch("/api/admin/reports/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
      });

      if (response.ok) {
        const newSchedule = await response.json();
        setSchedules([...schedules, newSchedule]);
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      alert("Failed to create schedule");
    }
  };

  const handleGenerate = async (type: string) => {
    try {
      const response = await fetch("/api/admin/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-report-${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sales Reports
              </h1>
              <p className="mt-2 text-gray-600">
                Generate and schedule automated reports
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AutomatedReports
          schedules={schedules}
          onSchedule={handleSchedule}
          onGenerate={handleGenerate}
        />

        {/* Legacy Report Scheduler (keep for backward compatibility) */}
        <div className="mt-8">
          <ReportScheduler />
        </div>
      </main>
    </div>
  );
}

