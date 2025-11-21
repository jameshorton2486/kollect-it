import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

/**
 * Server-side authentication helper for admin routes
 * 
 * This function checks if the user is authenticated and has admin privileges.
 * If not, it redirects to the appropriate page.
 * 
 * Usage in Server Components:
 * ```typescript
 * export default async function AdminPage() {
 *   const session = await requireAdmin();
 *   // User is guaranteed to be an authenticated admin here
 *   return <YourComponent session={session} />;
 * }
 * ```
 * 
 * Benefits over client-side checks:
 * - No redirect loops (server-side redirects are atomic)
 * - No flash of unauthorized content
 * - Better security (auth happens before page renders)
 * - Simpler code (no useEffect dependencies)
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  // Not logged in at all
  if (!session) {
    redirect("/admin/login");
  }
  
  // Logged in but not an admin
  if (session.user?.role !== "admin") {
    redirect("/");
  }
  
  // Valid admin session
  return session;
}

/**
 * Check if user is authenticated (any role)
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  return session;
}

/**
 * Get session without redirecting
 * Returns null if not authenticated
 */
export async function getSession() {
  return await getServerSession(authOptions);
}
