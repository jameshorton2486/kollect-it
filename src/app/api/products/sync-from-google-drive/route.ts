/**
 * KOLLECT-IT: Google Drive Sync API Route
 *
 * POST /api/products/sync-from-google-drive
 *
 * Fetches recently created/updated product.json files from Google Drive
 * Validates them, and queues for ImageKit sync
 */

import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as fs from "fs";

interface ProductJson {
  product_id: string;
  name: string;
  category: string;
  metadata: {
    validation_passed: boolean;
    imagekit_ready: boolean;
    google_drive_ready: boolean;
  };
  photos?: Array<{
    url: string;
    alt: string | null;
  }>;
}

interface SyncResult {
  product_id: string;
  name: string;
  status: "ready_for_imagekit" | "validation_failed" | "error";
  message: string;
  imagekit_queued?: boolean;
}

async function getGoogleDriveAuth() {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!credentialsPath) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS not configured");
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
}

async function downloadProductJson(
  drive: ReturnType<typeof google.drive>,
  fileId: string,
): Promise<ProductJson> {
  const response = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" },
  );

  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    response.data.on("data", (chunk: Buffer) => chunks.push(chunk));
    response.data.on("end", () => {
      try {
        const jsonContent = Buffer.concat(chunks).toString("utf-8");
        const product = JSON.parse(jsonContent) as ProductJson;
        resolve(product);
      } catch (error) {
        reject(
          new Error(
            `Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      }
    });
    response.data.on("error", reject);
  });
}

async function isAuthorized(request: Request): Promise<boolean> {
  const apiKeyHeader = request.headers.get("x-api-key");
  const authHeader = request.headers.get("authorization");
  const providedKey = apiKeyHeader || authHeader?.replace("Bearer ", "");
  const ingestKey = process.env.PRODUCT_INGEST_API_KEY;

  if (providedKey && ingestKey && providedKey === ingestKey) {
    return true;
  }

  const session = await getServerSession(authOptions);
  return !!session?.user && session.user.role === "admin";
}

export async function POST(request: Request) {
  const authorized = await isAuthorized(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const folderIdtoSync = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderIdtoSync) {
      return NextResponse.json(
        { error: "GOOGLE_DRIVE_FOLDER_ID not configured" },
        { status: 400 },
      );
    }

    const auth = await getGoogleDriveAuth();
    const drive = google.drive({ version: "v3", auth });

    // Query for recently modified product JSONs
    const response = await drive.files.list({
      q: `'${folderIdtoSync}' in parents and mimeType='application/json' and name contains '2025_' and trashed=false`,
      spaces: "drive",
      pageSize: 10,
      fields: "files(id, name, createdTime, modifiedTime)",
      orderBy: "modifiedTime desc",
    });

    const files = response.data.files || [];
    const syncResults: SyncResult[] = [];

    for (const file of files) {
      if (!file.id || !file.name) continue;

      try {
        const product = await downloadProductJson(drive, file.id);

        if (!product.metadata?.validation_passed) {
          syncResults.push({
            product_id: product.product_id || file.name,
            name: product.name || "Unknown",
            status: "validation_failed",
            message: "Product validation failed",
          });
          continue;
        }

        const imagekitReady = product.metadata?.imagekit_ready === true;

        syncResults.push({
          product_id: product.product_id,
          name: product.name,
          status: imagekitReady ? "ready_for_imagekit" : "validation_failed",
          message: imagekitReady
            ? `Ready for ImageKit: ${product.photos?.length || 0} photos`
            : "Not marked for ImageKit sync",
          imagekit_queued: imagekitReady,
        });

        // If ImageKit ready, queue for sync
        if (imagekitReady && product.photos && product.photos.length > 0) {
          try {
            const apiUrl =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            await fetch(`${apiUrl}/api/products/sync-imagekit`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                product_id: product.product_id,
                product_json: product,
              }),
            });

            console.log(`✅ ImageKit sync queued: ${product.product_id}`);
          } catch (error) {
            console.error(
              `⚠️  ImageKit queue failed for ${product.product_id}:`,
              error,
            );
          }
        }
      } catch (error) {
        syncResults.push({
          product_id: file.name.split("_")[0] || "unknown",
          name: file.name,
          status: "error",
          message: `Processing error: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }

    const successCount = syncResults.filter(
      (r) => r.status === "ready_for_imagekit",
    ).length;

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        products_checked: files.length,
        products_valid: successCount,
        results: syncResults,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Google Drive sync error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

