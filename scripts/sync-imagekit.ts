/**
 * KOLLECT-IT: ImageKit Sync Module
 *
 * Uploads photos from product.json to ImageKit CDN
 * Handles retries, batch uploads, and metadata tagging
 */

import ImageKit from "imagekit";
import * as fs from "fs";
import * as path from "path";

interface Photo {
  url: string;
  alt: string | null;
  sequence_order?: number;
  user_description?: string;
}

interface ProductJson {
  product_id: string;
  name: string;
  category: string;
  photos: Photo[];
}

interface SyncedPhoto {
  original_url: string;
  imagekit_url: string;
  imagekit_file_id: string;
  sequence_order: number;
  status: "success" | "failed";
  error?: string;
}

interface ImageKitSyncResult {
  product_id: string;
  total_photos: number;
  uploaded: number;
  failed: number;
  synced_photos: SyncedPhoto[];
  errors: Array<{ photo: string; error: string }>;
}

export class ImageKitSyncService {
  private imageKit: ImageKit;
  private maxRetries = 3;
  private retryDelayMs = 1000;

  constructor() {
    const publicKey =
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
      process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint =
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
      process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      throw new Error(
        "ImageKit credentials not fully configured in .env.local",
      );
    }

    this.imageKit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }

  /**
   * Sync all photos from a product to ImageKit
   */
  async syncProductPhotos(product: ProductJson): Promise<ImageKitSyncResult> {
    console.log(`🖼️  Starting ImageKit sync for: ${product.product_id}`);

    const result: ImageKitSyncResult = {
      product_id: product.product_id,
      total_photos: product.photos.length,
      uploaded: 0,
      failed: 0,
      synced_photos: [],
      errors: [],
    };

    for (let i = 0; i < product.photos.length; i++) {
      const photo = product.photos[i];
      const sequenceOrder = photo.sequence_order ?? i;

      try {
        const syncedPhoto = await this.uploadPhotoWithRetry(
          product.product_id,
          photo,
          sequenceOrder,
          i,
        );

        result.synced_photos.push(syncedPhoto);
        result.uploaded++;

        console.log(
          `   ✅ Uploaded (${i + 1}/${product.photos.length}): ${photo.url}`,
        );
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);

        result.synced_photos.push({
          original_url: photo.url,
          imagekit_url: "",
          imagekit_file_id: "",
          sequence_order: sequenceOrder,
          status: "failed",
          error: errorMsg,
        });

        result.errors.push({
          photo: photo.url,
          error: errorMsg,
        });

        result.failed++;

        console.error(
          `   ❌ Failed (${i + 1}/${product.photos.length}): ${errorMsg}`,
        );
      }
    }

    console.log(
      `📊 ImageKit sync complete: ${result.uploaded}/${result.total_photos} successful`,
    );

    return result;
  }

  /**
   * Upload a single photo with retry logic
   */
  private async uploadPhotoWithRetry(
    productId: string,
    photo: Photo,
    sequenceOrder: number,
    index: number,
    attempt = 1,
  ): Promise<SyncedPhoto> {
    try {
      // Resolve file path
      let fileBuffer: Buffer;

      if (photo.url.startsWith("http")) {
        // Download remote URL
        fileBuffer = await this.downloadRemotePhoto(photo.url);
      } else {
        // Local file
        const localPath = path.join(process.cwd(), "public", photo.url);

        if (!fs.existsSync(localPath)) {
          throw new Error(`File not found: ${localPath}`);
        }

        fileBuffer = fs.readFileSync(localPath);
      }

      // Upload to ImageKit
      const fileName = `${productId}_${String(index + 1).padStart(2, "0")}.jpg`;
      const folderPath = `/kollect-it/products/${productId}`;

      const uploadResponse = await this.imageKit.upload({
        file: fileBuffer,
        fileName,
        folder: folderPath,
        tags: [productId, "product"],
        customMetadata: {
          product_id: productId,
          sequence_order: String(sequenceOrder),
          alt_text: photo.alt || "",
        },
        useUniqueFileName: false,
        overwriteFile: true,
      });

      return {
        original_url: photo.url,
        imagekit_url: uploadResponse.url,
        imagekit_file_id: uploadResponse.fileId,
        sequence_order: sequenceOrder,
        status: "success",
      };
    } catch (error) {
      // Retry logic
      if (attempt < this.maxRetries) {
        console.log(
          `   ⏳ Retry attempt ${attempt}/${this.maxRetries - 1} for ${photo.url}...`,
        );

        await this.delay(this.retryDelayMs * attempt);
        return this.uploadPhotoWithRetry(
          productId,
          photo,
          sequenceOrder,
          index,
          attempt + 1,
        );
      }

      throw error;
    }
  }

  /**
   * Download a remote photo
   */
  private async downloadRemotePhoto(url: string): Promise<Buffer> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check connection to ImageKit
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to list files (minimal operation)
      await this.imageKit.listFiles({ limit: 1 });
      return true;
    } catch {
      return false;
    }
  }
}

export default ImageKitSyncService;
