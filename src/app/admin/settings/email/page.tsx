"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Force dynamic rendering - do not prerender this admin page
export const dynamic = "force-dynamic";

/**
 * Admin Email Settings Page
 * Placeholder page for email configuration settings
 */
export default function AdminEmailSettingsPage() {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-lux-pearl">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="heading-section text-lux-black mb-2">
            Email Settings
          </h1>
          <p className="text-ink-600">
            Configure email notification preferences and templates
          </p>
        </div>

        <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
          <p className="text-ink-600">
            Email settings configuration coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
