#!/usr/bin/env node
/**
 * KOLLECT-IT: Google Drive Watcher
 *
 * Monitors /Kollect-It/Products/ folder for new product.json files
 * Validates JSON, triggers ImageKit sync, and logs results
 *
 * Usage: bun run watch-google-drive
 */

import { google } from "googleapis";
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
  photos: Array<{
    url: string;
    alt: string | null;
  }>;
}

interface SyncLog {
  timestamp: string;
  product_id: string;
  status: "success" | "error" | "skipped";
  message: string;
  imagekit_triggered: boolean;
}

const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const CHECK_INTERVAL = 30000; // 30 seconds
const SYNC_LOG_FILE = "./logs/google-drive-sync.log";

class GoogleDriveWatcher {
  private drive: ReturnType<typeof google.drive>;
  private processedFiles: Set<string> = new Set();
  private syncLogs: SyncLog[] = [];

  constructor() {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS not set in .env.local");
    }

    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    this.drive = google.drive({ version: "v3", auth });
    this.setupLogging();
  }

  private setupLogging() {
    const logsDir = "./logs";
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  private log(entry: SyncLog) {
    this.syncLogs.push(entry);
    console.log(
      `[${entry.timestamp}] ${entry.status.toUpperCase()}: ${entry.product_id} - ${entry.message}`,
    );

    // Append to log file
    const logLine = JSON.stringify(entry);
    fs.appendFileSync(SYNC_LOG_FILE, logLine + "\n");
  }

  async watch() {
    console.log("🔍 Starting Google Drive watcher...");
    console.log(`📁 Monitoring folder: ${GOOGLE_DRIVE_FOLDER_ID}`);
    console.log(`⏱️  Check interval: ${CHECK_INTERVAL / 1000}s\n`);

    setInterval(
      () => this.checkForNewProducts().catch(console.error),
      CHECK_INTERVAL,
    );

    // Run immediately on start
    await this.checkForNewProducts();
  }

  private async checkForNewProducts() {
    try {
      const response = await this.drive.files.list({
        q: `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType='application/json' and name contains '2025_' and trashed=false`,
        spaces: "drive",
        pageSize: 50,
        fields: "files(id, name, createdTime, modifiedTime, size)",
        orderBy: "modifiedTime desc",
      });

      const files = response.data.files || [];

      if (files.length === 0) {
        return; // Silent if no files
      }

      for (const file of files) {
        if (!file.id || !file.name) continue;

        // Skip if already processed
        if (this.processedFiles.has(file.id)) {
          continue;
        }

        this.processedFiles.add(file.id);

        try {
          await this.processProductFile(file.id, file.name);
        } catch (error) {
          this.log({
            timestamp: new Date().toISOString(),
            product_id: file.name.split("_")[0] || "unknown",
            status: "error",
            message: `Failed to process: ${error instanceof Error ? error.message : String(error)}`,
            imagekit_triggered: false,
          });
        }
      }
    } catch (error) {
      console.error("❌ Error checking for new products:", error);
    }
  }

  private async processProductFile(
    fileId: string,
    fileName: string,
  ): Promise<void> {
    try {
      // Download file
      const response = await this.drive.files.get(
        { fileId, alt: "media" },
        { responseType: "stream" },
      );

      const chunks: Buffer[] = [];

      return new Promise((resolve, reject) => {
        response.data.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.data.on("end", async () => {
          try {
            const jsonContent = Buffer.concat(chunks).toString("utf-8");
            const product: ProductJson = JSON.parse(jsonContent);

            // Validate
            if (!product.metadata?.validation_passed) {
              this.log({
                timestamp: new Date().toISOString(),
                product_id: product.product_id || fileName,
                status: "skipped",
                message: "Validation not passed",
                imagekit_triggered: false,
              });
              resolve();
              return;
            }

            // Check if ready for ImageKit
            const imagekitReady = product.metadata?.imagekit_ready === true;

            this.log({
              timestamp: new Date().toISOString(),
              product_id: product.product_id,
              status: "success",
              message: `Loaded from Google Drive: ${product.name}`,
              imagekit_triggered: imagekitReady,
            });

            // Trigger ImageKit sync if needed
            if (imagekitReady && product.photos?.length > 0) {
              await this.triggerImageKitSync(product);
            }

            resolve();
          } catch (error) {
            reject(error);
          }
        });
        response.data.on("error", reject);
      });
    } catch (error) {
      throw new Error(
        `Failed to download ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async triggerImageKitSync(product: ProductJson): Promise<void> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const response = await fetch(`${apiUrl}/api/products/sync-imagekit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.product_id,
          product_json: product,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      await response.json(); // Consume response
      console.log(`   📤 ImageKit sync queued: ${product.product_id}`);
    } catch (error) {
      console.error(
        `   ⚠️  ImageKit sync failed for ${product.product_id}:`,
        error,
      );
    }
  }

  async stop() {
    console.log("\n👋 Stopping watcher...");
    process.exit(0);
  }
}

// Main execution
const watcher = new GoogleDriveWatcher();
watcher.watch().catch(console.error);

// Graceful shutdown
process.on("SIGINT", () => watcher.stop());
process.on("SIGTERM", () => watcher.stop());
