"use client";

/**
 * Traffic Analytics Page
 * Phase 6 Step 6 - Google Analytics integration admin page
 */

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TrafficAnalyticsDashboard } from "@/components/admin/TrafficAnalyticsDashboard";

export default function TrafficAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || (session.user as any).role !== "admin") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-ink-700">Loading...</div>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-lux-pearl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrafficAnalyticsDashboard />
      </div>
    </div>
  );
}

