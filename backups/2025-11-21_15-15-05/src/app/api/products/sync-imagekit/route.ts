/**
 * KOLLECT-IT: ImageKit Sync API Route
 *
 * POST /api/products/sync-imagekit
 *
 * Receives product.json with photos and uploads to ImageKit CDN
 * Updates metadata with ImageKit URLs and returns results
 */

import { NextResponse, NextRequest } from "next/server";
import ImageKitSyncService from "@/lib/imagekit-sync";

interface ProductJson {
  product_id: string;
  name: string;
  category: string;
  photos: Array<{
    url: string;
    alt: string | null;
    sequence_order?: number;
    user_description?: string;
  }>;
}

interface RequestBody {
  product_id: string;
  product_json: ProductJson;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.product_id || !body.product_json) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing product_id or product_json in request body",
        },
        { status: 400 },
      );
    }

    const product = body.product_json;

    // Validate photos array
    if (!Array.isArray(product.photos) || product.photos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product has no photos to sync",
        },
        { status: 400 },
      );
    }

    // Initialize ImageKit service
    const imageKitService = new ImageKitSyncService();

    // Test connection first
    const connectionOk = await imageKitService.testConnection();
    if (!connectionOk) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot connect to ImageKit. Check credentials in .env.local",
        },
        { status: 503 },
      );
    }

    // Perform sync
    const syncResult = await imageKitService.syncProductPhotos(product);

    // Build response
    const response = {
      success: syncResult.failed === 0,
      product_id: syncResult.product_id,
      sync_result: {
        total_photos: syncResult.total_photos,
        uploaded: syncResult.uploaded,
        failed: syncResult.failed,
        photos: syncResult.synced_photos.map((photo) => ({
          original: photo.original_url,
          imagekit_url: photo.imagekit_url,
          sequence: photo.sequence_order,
          status: photo.status,
        })),
      },
      timestamp: new Date().toISOString(),
    };

    if (syncResult.errors.length > 0) {
      Object.assign(response, {
        errors: syncResult.errors,
      });
    }

    const statusCode = syncResult.failed === 0 ? 200 : 207; // 207 = Partial Success

    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    console.error("ImageKit sync API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

