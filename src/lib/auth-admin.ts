import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Require admin authentication for API routes
 * Returns the session if authenticated as admin, throws error otherwise
 */
export async function requireAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized - No session");
  }
  
  // Check if user exists and has admin role
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });
  
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized - Admin access required");
  }
  
  return session;
}

/**
 * Wrapper for admin API routes to ensure proper authentication
 */
export function withAdminAuth(handler: Function) {
  return async (request: any, ...args: any[]) => {
    try {
      await requireAdminAuth();
      return await handler(request, ...args);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: error.message }, 
          { status: 401 }
        );
      }
      throw error;
    }
  };
}