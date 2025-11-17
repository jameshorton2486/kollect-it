"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SellerInquiryManager } from "@/components/admin/SellerInquiryManager";

/**
 * Seller Management Page
 * Phase 6 Step 5 - Seller inquiry tracking and consignment management
 */

export default function SellerManagementPage() {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SellerInquiryManager />
      </div>
    </div>
  );
}

