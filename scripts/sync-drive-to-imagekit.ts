#!/usr/bin/env bun

/**
 * Google Drive to ImageKit Sync Script
 * Syncs images from Google Drive folder to ImageKit with duplicate detection
 *
 * Usage: bun run scripts/sync-drive-to-imagekit.ts
 *
 * Environment variables required:
 * - GOOGLE_APPLICATION_CREDENTIALS: path to service account JSON
 * - GOOGLE_DRIVE_FOLDER_ID: ID of folder to sync from
 * - NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: ImageKit public key
 * - IMAGEKIT_PRIVATE_KEY: ImageKit private key
 * - NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: ImageKit URL endpoint
 */

import ImageKit from "imagekit";
import { google } from "googleapis";
import fs from "fs/promises";
import path from "path";
import {
  GoogleDriveImageFile,
  SyncOperationResult,
  SyncResultsReport,
  SyncSummary,
  ImageKitUploadResult,
} from "../types/imagekit";

/**
 * Supported image MIME types
 */
const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Configuration from environment
 */
const config = {
  googleCredentialsPath:
    process.env.GOOGLE_APPLICATION_CREDENTIALS || "./google-credentials.json",
  driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
 imagekit: {
    publicKey:
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
      process.env.IMAGEKIT_PUBLIC_KEY ||
      "",
    privateKey: (process.env.IMAGEKIT_PRIVATE_KEY || "").replace(
      /^private_/,
      "",
    ),
    urlEndpoint:
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
      process.env.IMAGEKIT_URL_ENDPOINT ||
      "",
  },
};

/**
 * Initialize ImageKit instance
 */
const imagekit = new ImageKit({
  publicKey: config.imagekit.publicKey,
  privateKey: config.imagekit.privateKey,
  urlEndpoint: config.imagekit.urlEndpoint,
});

/**
 * Initialize Google Drive API
 */
async function initializeDriveApi() {
  try {
    const credentials = JSON.parse(
      await fs.readFile(config.googleCredentialsPath, "utf-8"),
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    return google.drive({ version: "v3", auth });
  } catch (error) {
    console.error("❌ Failed to initialize Google Drive API:", error);
    throw error;
  }
}

/**
 * Get all images from Google Drive folder
 */
async function getImagesFromDrive(
  drive: ReturnType<typeof google.drive>,
  folderId: string,
): Promise<GoogleDriveImageFile[]> {
  try {
    console.log("📂 Fetching images from Google Drive folder...");

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false and (${SUPPORTED_MIME_TYPES.map(
        (mime) => `mimeType='${mime}'`,
      ).join(" or ")})`,
      spaces: "drive",
      fields:
        "files(id, name, mimeType, size, webContentLink, createdTime, modifiedTime)",
      pageSize: 100,
    });

    const files = response.data.files || [];
    console.log(`✅ Found ${files.length} images in Google Drive`);

    return files as GoogleDriveImageFile[];
  } catch (error) {
    console.error("❌ Failed to fetch images from Google Drive:", error);
    throw error;
  }
}

/**
 * Check if file already exists in ImageKit
 */
async function fileExistsInImageKit(
  fileName: string,
  folderPath: string = "/products",
): Promise<boolean> {
  try {
    const response = await imagekit.listFiles({
      path: folderPath,
      searchQuery: `name = "${fileName}"`,
    });

    return response.length > 0;
  } catch (error) {
    console.warn(
      `⚠️  Error checking if file exists in ImageKit: ${fileName}`,
      error,
    );
    return false;
  }
}

/**
 * Download file from Google Drive
 */
async function downloadFromDrive(
  drive: ReturnType<typeof google.drive>,
  fileId: string,
  fileName: string,
): Promise<Buffer> {
  try {
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" },
    );

    return Buffer.from(response.data as ArrayBuffer);
  } catch (error) {
    console.error(
      `❌ Failed to download file from Google Drive: ${fileName}`,
      error,
    );
    throw error;
  }
}

/**
 * Upload file to ImageKit
 */
async function uploadToImageKit(
  buffer: Buffer,
  fileName: string,
  folderPath: string = "/products",
): Promise<ImageKitUploadResult> {
  try {
    const result = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: folderPath,
      tags: ["drive-sync", "auto-imported"],
    });

    return result as unknown as ImageKitUploadResult;
  } catch (error) {
    console.error(`❌ Failed to upload file to ImageKit: ${fileName}`, error);
    throw error;
  }
}

/**
 * Main sync function
 */
async function syncDriveToImageKit(
  driveFolderId: string,
  imagekitFolder: string = "/products",
  skipExisting: boolean = true,
): Promise<SyncResultsReport> {
  const startTime = new Date();
  const results: SyncOperationResult[] = [];
  const errors: string[] = [];

  console.log("\n🚀 Starting Google Drive to ImageKit Sync");
  console.log(`📁 Drive Folder ID: ${driveFolderId}`);
  console.log(`🖼️  ImageKit Folder: ${imagekitFolder}`);
  console.log(`⏭️  Skip Existing: ${skipExisting}\n`);

  try {
    // Initialize Drive API
    const drive = await initializeDriveApi();

    // Get images from Drive
    const driveFiles = await getImagesFromDrive(drive, driveFolderId);

    if (driveFiles.length === 0) {
      console.log("⚠️  No images found in Google Drive folder");
      const summary: SyncSummary = {
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        totalDuration: Date.now() - startTime.getTime(),
        filesFound: 0,
        filesUploaded: 0,
        filesSkipped: 0,
        filesFailed: 0,
        totalBytesUploaded: 0,
        errors,
      };

      return {
        summary,
        results,
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      };
    }

    // Process each file
    let uploaded = 0;
    let skipped = 0;
    let failed = 0;
    let totalBytes = 0;

    for (let i = 0; i < driveFiles.length; i++) {
      const file = driveFiles[i];
      const progress = `[${i + 1}/${driveFiles.length}]`;

      try {
        console.log(`\n${progress} Processing: ${file.name}`);

        // Check if file already exists
        if (skipExisting) {
          const exists = await fileExistsInImageKit(file.name, imagekitFolder);
          if (exists) {
            console.log(`⏭️  Skipping (already exists): ${file.name}`);
            results.push({
              success: true,
              fileName: file.name,
              filePath: `${imagekitFolder}/${file.name}`,
              driveFileId: file.id,
              skipped: true,
              skipReason: "File already exists in ImageKit",
              fileSize: parseInt(file.size, 10),
            });
            skipped++;
            continue;
          }
        }

        // Download from Drive
        console.log(`⬇️  Downloading from Google Drive...`);
        const buffer = await downloadFromDrive(drive, file.id, file.name);
        const fileSize = buffer.length;

        // Upload to ImageKit
        console.log(`⬆️  Uploading to ImageKit...`);
        const uploadResult = await uploadToImageKit(
          buffer,
          file.name,
          imagekitFolder,
        );

        // Record success
        console.log(`✅ Successfully uploaded: ${file.name}`);
        results.push({
          success: true,
          fileName: file.name,
          filePath: uploadResult.filePath,
          driveFileId: file.id,
          imagekitFileId: uploadResult.fileId,
          skipped: false,
          fileSize,
        });

        uploaded++;
        totalBytes += fileSize;

        // Add delay to avoid rate limiting
        if (i < driveFiles.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`❌ Failed to process: ${file.name}`);
        console.error(`   Error: ${errorMsg}`);

        results.push({
          success: false,
          fileName: file.name,
          filePath: `${imagekitFolder}/${file.name}`,
          driveFileId: file.id,
          skipped: false,
          error: errorMsg,
          fileSize: parseInt(file.size, 10),
        });

        errors.push(`${file.name}: ${errorMsg}`);
      }
    }

    // Generate summary
    const endTime = new Date();
    const summary: SyncSummary = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalDuration: endTime.getTime() - startTime.getTime(),
      filesFound: driveFiles.length,
      filesUploaded: uploaded,
      filesSkipped: skipped,
      filesFailed: failed,
      totalBytesUploaded: totalBytes,
      errors,
    };

    // Log summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 SYNC SUMMARY");
    console.log("=".repeat(60));
    console.log(`📁 Files Found:     ${summary.filesFound}`);
    console.log(`✅ Files Uploaded:  ${summary.filesUploaded}`);
    console.log(`⏭️  Files Skipped:   ${summary.filesSkipped}`);
    console.log(`❌ Files Failed:    ${summary.filesFailed}`);
    console.log(
      `💾 Total Bytes:     ${(summary.totalBytesUploaded / 1024 / 1024).toFixed(2)} MB`,
    );
    console.log(
      `⏱️  Duration:        ${(summary.totalDuration / 1000).toFixed(2)}s`,
    );
    console.log("=".repeat(60) + "\n");

    // Save results to file
    const reportPath = path.join(process.cwd(), "sync-results.json");
    const report: SyncResultsReport = {
      summary,
      results,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    };

    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`💾 Results saved to: ${reportPath}\n`);

    return report;
  } catch (error) {
    console.error("❌ Sync failed:", error);
    throw error;
  }
}

/**
 * Run sync if called directly
 */
// @ts-ignore - Bun-specific property
if (import.meta.main) {
  const driveFolderId = config.driveFolderId;

  if (!driveFolderId) {
    console.error(
      "❌ Error: GOOGLE_DRIVE_FOLDER_ID environment variable is not set",
    );
    process.exit(1);
  }

  if (!config.imagekit.publicKey || !config.imagekit.privateKey) {
    console.error("❌ Error: ImageKit credentials are not set");
    process.exit(1);
  }

  syncDriveToImageKit(driveFolderId)
    .then(() => {
      console.log("✅ Sync completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Sync failed:", error);
      process.exit(1);
    });
}

// Export for use in API routes
export { syncDriveToImageKit, getImagesFromDrive, fileExistsInImageKit };
