#!/usr/bin/env bun
/**
 * ImageKit Sync Status Checker
 * Displays the results of the last sync operation
 */

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message: string, color: keyof typeof colors = "reset"): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title: string): void {
  console.log("\n");
  log(`${"=".repeat(60)}`, "cyan");
  log(`  ${title}`, "bright");
  log(`${"=".repeat(60)}`, "cyan");
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

interface SyncResult {
  fileName: string;
  status: "success" | "skipped" | "error";
  message: string;
  imagekitUrl?: string;
  error?: string;
}

interface SyncSummary {
  filesFound: number;
  filesUploaded: number;
  filesSkipped: number;
  filesFailed: number;
  totalBytes: number;
  duration: number;
  startTime: string;
  endTime: string;
}

interface SyncReport {
  summary: SyncSummary;
  results: SyncResult[];
}

async function main(): Promise<void> {
  const resultsFile = resolve("./sync-results.json");

  logSection("ImageKit Sync Status");

  if (!existsSync(resultsFile)) {
    log("⚠️  No sync results found yet", "yellow");
    log("\nRun your first sync with:", "blue");
    log("  bun run sync-images", "cyan");
    return;
  }

  try {
    const content = readFileSync(resultsFile, "utf-8");
    const report: SyncReport = JSON.parse(content);
    const { summary, results } = report;

    // Display summary
    logSection("Sync Summary");

    log(
      `📁 Files Found:      ${summary.filesFound}`,
      summary.filesFound > 0 ? "green" : "yellow",
    );
    log(
      `✅ Files Uploaded:   ${summary.filesUploaded}`,
      summary.filesUploaded > 0 ? "green" : "yellow",
    );
    log(
      `⏭️  Files Skipped:    ${summary.filesSkipped}`,
      summary.filesSkipped > 0 ? "yellow" : "reset",
    );
    log(
      `❌ Files Failed:     ${summary.filesFailed}`,
      summary.filesFailed > 0 ? "red" : "green",
    );

    log(`\n💾 Total Size:       ${formatBytes(summary.totalBytes)}`, "cyan");
    log(`⏱️  Duration:         ${formatDuration(summary.duration)}`, "cyan");
    log(
      `🕐 Start Time:       ${new Date(summary.startTime).toLocaleString()}`,
      "blue",
    );
    log(
      `🕐 End Time:         ${new Date(summary.endTime).toLocaleString()}`,
      "blue",
    );

    // Display results
    logSection("Detailed Results");

    const successFiles = results.filter((r) => r.status === "success");
    const skippedFiles = results.filter((r) => r.status === "skipped");
    const errorFiles = results.filter((r) => r.status === "error");

    if (successFiles.length > 0) {
      log(`✅ Uploaded (${successFiles.length}):`, "green");
      successFiles.slice(0, 5).forEach((file) => {
        log(`   ${file.fileName}`, "green");
      });
      if (successFiles.length > 5) {
        log(`   ... and ${successFiles.length - 5} more`, "green");
      }
    }

    if (skippedFiles.length > 0) {
      log(`\n⏭️  Skipped (${skippedFiles.length}):`, "yellow");
      skippedFiles.slice(0, 5).forEach((file) => {
        log(`   ${file.fileName}`, "yellow");
      });
      if (skippedFiles.length > 5) {
        log(`   ... and ${skippedFiles.length - 5} more`, "yellow");
      }
    }

    if (errorFiles.length > 0) {
      log(`\n❌ Errors (${errorFiles.length}):`, "red");
      errorFiles.slice(0, 5).forEach((file) => {
        log(`   ${file.fileName}: ${file.error || file.message}`, "red");
      });
      if (errorFiles.length > 5) {
        log(`   ... and ${errorFiles.length - 5} more`, "red");
      }
    }

    // Display statistics
    logSection("Statistics");

    const successRate =
      summary.filesFound > 0
        ? Math.round((summary.filesUploaded / summary.filesFound) * 100)
        : 0;
    log(
      `Success Rate: ${successRate}%`,
      successRate === 100 ? "green" : "yellow",
    );

    const avgFileSize =
      summary.filesFound > 0
        ? formatBytes(summary.totalBytes / summary.filesFound)
        : "0 Bytes";
    log(`Average File Size: ${avgFileSize}`, "blue");

    const avgSpeed =
      summary.filesUploaded > 0
        ? formatBytes((summary.totalBytes / summary.duration) * 1000)
        : "0 Bytes/s";
    log(`Upload Speed: ${avgSpeed}/s`, "blue");

    log("\n✅ For more details, see sync-results.json", "green");
  } catch (error) {
    log("❌ Failed to read sync results", "red");
    log(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
      "red",
    );
  }
}

main();
