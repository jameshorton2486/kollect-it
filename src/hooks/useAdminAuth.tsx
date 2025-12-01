/**
 * Admin Authentication Hook
 * Centralized authentication check for admin pages
 *
 * Prevents code duplication across admin routes and provides
 * consistent authentication handling
 */

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UseAdminAuthReturn {
  session: any;
  status: "authenticated" | "loading" | "unauthenticated";
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Hook for admin pages to require authentication
 * Automatically redirects unauthenticated users to login
 *
 * @returns Object with session, status, loading state, and auth flags
 *
 * @example
 * ```typescript
 * export default function AdminPage() {
 *   const { session, isLoading } = useAdminAuth();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!session) return null; // Redirect handled by hook
 *
 *   return <div>Admin content</div>;
 * }
 * ```
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    // Redirect to login if unauthenticated
    if (status === "unauthenticated") {
      console.warn("Unauthenticated access attempt to admin area");
      router.push("/api/auth/signin?callbackUrl=/admin/dashboard");
    }
  }, [status, router]);

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
  };
}

/**
 * HOC for wrapping admin pages with authentication
 * Usage: export default withAdminAuth(AdminPage);
 */
export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  return function ProtectedComponent(props: P) {
    const { session, isLoading } = useAdminAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      );
    }

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}

