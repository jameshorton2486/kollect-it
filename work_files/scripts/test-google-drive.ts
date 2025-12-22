#!/usr/bin/env node
/**
 * KOLLECT-IT: Google Drive Connection Tester
 *
 * Tests connection to Google Drive API
 * Verifies service account credentials and folder access
 *
 * Usage: bun run test-google-drive
 */

import { google } from "googleapis";
import * as fs from "fs";

async function testGoogleDriveConnection() {
  console.log("🔍 Testing Google Drive Connection\n");

  try {
    // Check environment variables
    console.log("📋 Environment Variables:");

    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const credentialsOk = credentialsPath && fs.existsSync(credentialsPath);
    console.log(
      `   ${credentialsOk ? "✅" : "❌"} GOOGLE_APPLICATION_CREDENTIALS: ${credentialsPath || "[NOT SET]"}`,
    );

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const folderOk = !!folderId;
    console.log(
      `   ${folderOk ? "✅" : "❌"} GOOGLE_DRIVE_FOLDER_ID: ${folderId || "[NOT SET]"}`,
    );
    console.log();

    if (!credentialsOk || !folderOk) {
      console.error("❌ Missing required environment variables\n");
      console.error("Add to .env.local:");
      if (!credentialsOk) {
        console.error(
          "   GOOGLE_APPLICATION_CREDENTIALS=./google-drive-service-account.json",
        );
      }
      if (!folderOk) {
        console.error("   GOOGLE_DRIVE_FOLDER_ID=<your-folder-id>");
      }
      process.exit(1);
    }

    // Read and validate credentials
    console.log("🔐 Validating Credentials:");
    let credentials: Record<string, unknown>;
    try {
      const credContent = fs.readFileSync(credentialsPath, "utf-8");
      credentials = JSON.parse(credContent);
      console.log("   ✅ Credentials file parsed");

      const requiredFields = [
        "type",
        "project_id",
        "private_key",
        "client_email",
      ];
      const missing = requiredFields.filter((f) => !(f in credentials));

      if (missing.length > 0) {
        console.error(`   ❌ Missing fields: ${missing.join(", ")}`);
        process.exit(1);
      }
      console.log("   ✅ All required fields present");
    } catch (error) {
      console.error(
        `   ❌ Failed to parse: ${error instanceof Error ? error.message : String(error)}`,
      );
      process.exit(1);
    }
    console.log();

    // Initialize auth
    console.log("🚀 Initializing Google Auth:");
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    console.log("   ✅ Auth initialized\n");

    // Test connection
    console.log("📡 Test 1: List Files (Connection Test)");
    const drive = google.drive({ version: "v3", auth });

    try {
      const response = await drive.files.list({
        pageSize: 1,
        fields: "files(id, name)",
      });

      console.log("   ✅ Connection successful");
      console.log(
        `   📊 Files in drive: ${response.data.files?.length || 0}\n`,
      );
    } catch (error) {
      console.error(
        `   ❌ Connection failed: ${error instanceof Error ? error.message : String(error)}\n`,
      );
      throw error;
    }

    // Test folder access
    console.log("📁 Test 2: Access Product Folder");
    try {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        pageSize: 10,
        fields: "files(id, name, mimeType, createdTime)",
      });

      const files = response.data.files || [];
      console.log(`   ✅ Folder accessible`);
      console.log(`   📊 Files in folder: ${files.length}`);

      if (files.length > 0) {
        console.log("   📋 Recent files:");
        for (const file of files.slice(0, 5)) {
          console.log(`      • ${file.name}`);
        }
        if (files.length > 5) {
          console.log(`      ... and ${files.length - 5} more`);
        }
      }
      console.log();
    } catch (error) {
      console.error(
        `   ❌ Folder access failed: ${error instanceof Error ? error.message : String(error)}\n`,
      );
      throw error;
    }

    // Test product JSON reading
    console.log("📄 Test 3: Product JSON Files");
    try {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and mimeType='application/json' and trashed=false`,
        pageSize: 10,
        fields: "files(id, name, createdTime)",
        orderBy: "createdTime desc",
      });

      const jsonFiles = response.data.files || [];
      console.log(`   ✅ Query successful`);
      console.log(`   📄 JSON files: ${jsonFiles.length}`);

      if (jsonFiles.length > 0) {
        console.log("   📋 Recent products:");
        for (const file of jsonFiles.slice(0, 3)) {
          console.log(`      • ${file.name}`);
        }
        if (jsonFiles.length > 3) {
          console.log(`      ... and ${jsonFiles.length - 3} more`);
        }
      }
      console.log();
    } catch (error) {
      console.error(
        `   ⚠️  No JSON files found or error: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }

    console.log("═══════════════════════════════");
    console.log("✅ All Google Drive tests passed!");
    console.log("═══════════════════════════════\n");
    console.log("You are ready to sync products using:");
    console.log("   bun run watch-google-drive\n");
    console.log("Or manually trigger:");
    console.log(
      "   curl -X POST http://localhost:3000/api/products/sync-from-google-drive\n",
    );

    process.exit(0);
  } catch (error) {
    console.log("═══════════════════════════════");
    console.error("❌ Google Drive test failed");
    console.log("═══════════════════════════════\n");

    console.error("Troubleshooting:");
    console.error("1. Verify GOOGLE_APPLICATION_CREDENTIALS file path");
    console.error("2. Confirm service account has Drive API access");
    console.error("3. Check GOOGLE_DRIVE_FOLDER_ID is correct");
    console.error("4. Verify service account email has folder access\n");

    process.exit(1);
  }
}

testGoogleDriveConnection();
