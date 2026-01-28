"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    // Client-side redirect to maintain dynamic rendering
    router.replace("/admin/settings");
  }, [router]);

  // Return null during redirect to prevent flash
  return null;
}
