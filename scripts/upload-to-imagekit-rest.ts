#!/usr/bin/env bun

/**
 * ImageKit Direct REST API Upload Script
 * Uses ImageKit REST API directly instead of SDK (bypasses SDK authentication issues)
 *
 * Usage: bun run scripts/upload-to-imagekit-rest.ts
 */

import { google } from "googleapis";
import fs from "fs/promises";

const config = {
  googleCredentialsPath:
    process.env.GOOGLE_APPLICATION_CREDENTIALS || "./google-credentials.json",
  driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
  imagekit: {
    publicKey:
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
      process.env.IMAGEKIT_PUBLIC_KEY ||
      "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint:
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
      process.env.IMAGEKIT_URL_ENDPOINT ||
      "",
  },
};

const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
}

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

async function getImagesFromDrive(
  drive: ReturnType<typeof google.drive>,
  folderId: string,
): Promise<DriveFile[]> {
  try {
    console.log("📂 Fetching images from Google Drive folder...");

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false and (${SUPPORTED_MIME_TYPES.map(
        (mime) => `mimeType='${mime}'`,
      ).join(" or ")})`,
      spaces: "drive",
      fields: "files(id, name, mimeType, size)",
      pageSize: 100,
    });

    const files = response.data.files || [];
    console.log(`✅ Found ${files.length} images in Google Drive\n`);

    return files as DriveFile[];
  } catch (error) {
    console.error("❌ Failed to fetch images from Google Drive:", error);
    throw error;
  }
}

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

async function uploadToImageKitREST(
  buffer: Buffer,
  fileName: string,
  folder: string = "/products",
): Promise<{ fileId: string; filePath: string; url: string }> {
  try {
    // Create auth header: base64 of privateKey:
    const auth = Buffer.from(`${config.imagekit.privateKey}:`).toString(
      "base64",
    );

    const formData = new FormData();
    // @ts-ignore - Buffer to Blob conversion works at runtime
    const blob = new Blob([buffer]);
    formData.append("file", blob);
    formData.append("fileName", fileName);
    formData.append("folder", folder);
    formData.append("overwrite", "false");
    formData.append("tags", "drive-sync,auto-imported");

    const response = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ ImageKit upload failed: ${response.status}`, errorData);
      throw new Error(
        `ImageKit upload failed: ${response.status} - ${errorData}`,
      );
    }

    const result = (await response.json()) as {
      fileId: string;
      filePath: string;
      url: string;
    };

    return result;
  } catch (error) {
    console.error(`❌ Failed to upload file to ImageKit: ${fileName}`, error);
    throw error;
  }
}

async function main() {
  const startTime = new Date();

  console.log("\n🚀 Starting Google Drive to ImageKit Upload (REST API)");
  console.log(`📁 Drive Folder ID: ${config.driveFolderId}`);
  console.log(`🖼️  ImageKit Folder: /products\n`);

  try {
    // Validate config
    if (!config.imagekit.privateKey) {
      throw new Error("IMAGEKIT_PRIVATE_KEY not set in environment");
    }

    if (!config.driveFolderId) {
      throw new Error("GOOGLE_DRIVE_FOLDER_ID not set in environment");
    }

    // Initialize Drive API
    const drive = await initializeDriveApi();

    // Get images from Drive
    const driveFiles = await getImagesFromDrive(drive, config.driveFolderId);

    if (driveFiles.length === 0) {
      console.log("⚠️  No images found in Google Drive folder");
      return;
    }

    let uploaded = 0;
    let failed = 0;

    for (let i = 0; i < driveFiles.length; i++) {
      const file = driveFiles[i];
      const progress = `[${i + 1}/${driveFiles.length}]`;

      try {
        console.log(`${progress} Processing: ${file.name}`);

        // Download from Drive
        console.log(`  ⬇️  Downloading from Google Drive...`);
        const buffer = await downloadFromDrive(drive, file.id, file.name);

        // Upload to ImageKit using REST API
        console.log(`  ⬆️  Uploading to ImageKit (REST API)...`);
        const uploadResult = await uploadToImageKitREST(buffer, file.name);

        console.log(`  ✅ UPLOADED: ${file.name}`);
        console.log(`     URL: ${uploadResult.url}\n`);

        uploaded++;

        // Add delay to avoid rate limiting
        if (i < driveFiles.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`  ❌ FAILED: ${file.name}`);
        console.error(`     Error: ${errorMsg}\n`);
      }
    }

    // Summary
    const endTime = new Date();
    const duration = ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(
      2,
    );

    console.log("=".repeat(60));
    console.log("📊 UPLOAD SUMMARY");
    console.log("=".repeat(60));
    console.log(`📁 Files Found:     ${driveFiles.length}`);
    console.log(`✅ Uploaded:        ${uploaded}`);
    console.log(`❌ Failed:          ${failed}`);
    console.log(`⏱️  Duration:        ${duration}s`);
    console.log("=".repeat(60));

    if (failed === 0) {
      console.log(
        `\n🎉 SUCCESS: All ${uploaded} files uploaded to ImageKit!\n`,
      );
    } else {
      console.log(`\n⚠️  COMPLETED WITH ${failed} ERRORS\n`);
    }
  } catch (error) {
    console.error("\n❌ Upload process failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
