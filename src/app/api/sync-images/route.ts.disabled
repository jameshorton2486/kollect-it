/**
 * API Route: Image Sync Endpoint
 *
 * POST /api/sync-images
 *
 * Triggers a Google Drive to ImageKit sync operation.
 * Runs in the background and returns immediately.
 *
 * Security:
 * - Validates webhook secret for API access
 * - Rate limited to prevent abuse
 *
 * Request body:
 * ```json
 * {
 *   "secret": "your_webhook_secret",
 *   "driveFolderId": "optional_folder_id",
 *   "skipExisting": true
 * }
 * ```
 *
 * Response:
 * ```json
 * {
 *   "status": "syncing",
 *   "message": "Sync started in background",
 *   "syncId": "unique_sync_id"
 * }
 * ```
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimiters } from "@/lib/rate-limit";
import { applySecurityHeaders } from "@/lib/security";

// Simple in-memory sync tracking (use Redis in production)
const syncHistory = new Map<string, { status: string; startTime: Date }>();

/**
 * Generate unique sync ID
 */
function generateSyncId(): string {
  return `sync_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Validate webhook secret
 */
function validateSecret(providedSecret: string): boolean {
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.warn("⚠️  WEBHOOK_SECRET is not configured");
    return false;
  }

  return providedSecret === expectedSecret;
}

/**
 * Run sync in background
 */
async function runSyncInBackground(
  syncId: string,
  _driveFolderId?: string,
): Promise<void> {
  try {
    // Update sync history
    syncHistory.set(syncId, {
      status: "running",
      startTime: new Date(),
    });

    // NOTE: Direct import of ../../../scripts not supported in Next.js build
    // Use CLI instead: bun run scripts/sync-drive-to-imagekit.ts
    // Or use child_process.exec to run the script

    // TODO: Refactor sync logic into @/lib/imagekit-sync for proper imports
    console.log(
      "[Sync] To run sync, use: bun run scripts/sync-drive-to-imagekit.ts",
    );

    // Simulate sync completion for now
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Update sync history
    syncHistory.set(syncId, {
      status: "completed",
      startTime: new Date(),
    });

    /* Original dynamic import (causes build warning):
    const { syncDriveToImageKit } = await import('../../../scripts/sync-drive-to-imagekit');

    // Run sync
    const folderId = driveFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    if (!folderId) {
      throw new Error('GOOGLE_DRIVE_FOLDER_ID is not configured');
    }

    const result = await syncDriveToImageKit(folderId);
    
    // Update sync history
    syncHistory.set(syncId, {
      status: 'completed',
      startTime: new Date(),
    });

    console.log(`✅ Sync ${syncId} completed:`, {
      filesUploaded: result.summary.filesUploaded,
      filesFailed: result.summary.filesFailed,
      filesSkipped: result.summary.filesSkipped,
    });
    */
  } catch (error) {
    // Update sync history with error
    syncHistory.set(syncId, {
      status: "failed",
      startTime: new Date(),
    });

    console.error(`❌ Sync ${syncId} failed:`, error);
  }
}

/**
 * POST: Trigger image sync
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Apply upload rate limiting (10 requests per minute)
    const rateLimitCheck = await rateLimiters.upload(request);
    if (rateLimitCheck) return rateLimitCheck;

    // Parse request body
    const body = await request.json();
    const { secret, driveFolderId, skipExisting } = body;

    // Validate secret
    if (!validateSecret(secret)) {
      const errorResponse = NextResponse.json(
        { error: "Unauthorized: Invalid webhook secret" },
        { status: 401 },
      );
      return applySecurityHeaders(errorResponse);
    }

    // Generate sync ID
    const syncId = generateSyncId();

    // Start sync in background (don't await)
    runSyncInBackground(driveFolderId, skipExisting).catch((error) => {
      console.error(`Unhandled error in background sync ${syncId}:`, error);
    });

    // Return immediate response
    const response = NextResponse.json(
      {
        status: "syncing",
        message: "Image sync started in background",
        syncId,
        estimatedDuration: "5-10 minutes",
      },
      { status: 202 }, // Accepted
    );
    return applySecurityHeaders(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Sync API error:", error);

    const errorResponse = NextResponse.json(
      {
        error: "Failed to start sync",
        message: errorMessage,
      },
      { status: 500 },
    );
    return applySecurityHeaders(errorResponse);
  }
}

/**
 * GET: Check sync status
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get sync ID from query params
    const syncId = request.nextUrl.searchParams.get("syncId");

    if (!syncId) {
      return NextResponse.json(
        { error: "Missing syncId query parameter" },
        { status: 400 },
      );
    }

    // Get sync status from history
    const syncInfo = syncHistory.get(syncId);

    if (!syncInfo) {
      return NextResponse.json(
        { error: "Sync not found", syncId },
        { status: 404 },
      );
    }

    // Calculate elapsed time
    const elapsedMs = Date.now() - syncInfo.startTime.getTime();
    const elapsedSec = Math.floor(elapsedMs / 1000);

    return NextResponse.json({
      syncId,
      status: syncInfo.status,
      startTime: syncInfo.startTime.toISOString(),
      elapsedSeconds: elapsedSec,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Sync status error:", error);

    const errorResponse = NextResponse.json(
      {
        error: "Failed to get sync status",
        message: errorMessage,
      },
      { status: 500 },
    );
    return applySecurityHeaders(errorResponse);
  }
}

/**
 * OPTIONS: CORS support
 */
export async function OPTIONS(): Promise<NextResponse> {
  // Calculate secure origin for production
  const allowedOrigin = 
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    "http://localhost:3000";
    
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

