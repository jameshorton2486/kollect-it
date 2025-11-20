#!/usr/bin/env bun
/**
 * Automated Error Summary Generator for AI Agents
 * 
 * This script analyzes log files and generates comprehensive, AI-ready error summaries
 * that provide enough context for AI agents to suggest fixes immediately.
 * 
 * Usage:
 *   bun run scripts/generate-error-summary.ts                    # All logs
 *   bun run scripts/generate-error-summary.ts --last=1h          # Last hour
 *   bun run scripts/generate-error-summary.ts --last=30m         # Last 30 minutes
 *   bun run scripts/generate-error-summary.ts --date=2025-11-18  # Specific date
 * 
 * Output: error-summary-ai.md (ready to share with AI assistants)
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

interface LogEntry {
  level: string;
  msg: string;
  time: string;
  requestId?: string;
  route?: string;
  method?: string;
  ip?: string;
  userId?: string;
  email?: string;
  attemptedEmail?: string;
  error?: {
    message?: string;
    name?: string;
    stack?: string;
  };
  [key: string]: unknown;
}

interface ErrorGroup {
  count: number;
  firstSeen: string;
  lastSeen: string;
  affectedUsers: Set<string>;
  affectedRoutes: Set<string>;
  example: LogEntry;
}

interface ErrorSummary {
  timestamp: string;
  totalErrors: number;
  totalWarnings: number;
  period: string;
  criticalIssues: {
    issue: string;
    count: number;
    firstSeen: string;
    lastSeen: string;
    affectedUsers: Set<string>;
    affectedRoutes: Set<string>;
    exampleError: LogEntry;
  }[];
  authFailures: {
    total: number;
    byReason: Record<string, number>;
    examples: LogEntry[];
  };
  apiErrors: {
    total: number;
    by5xx: number;
    by4xx: number;
    byRoute: Record<string, number>;
    examples: LogEntry[];
  };
  recommendations: string[];
}

function parseTimeFilter(filter?: string): Date | null {
  if (!filter) return null;
  
  const now = new Date();
  
  // Handle relative times like "1h", "30m", "2d"
  const match = filter.match(/^(\d+)([mhd])$/);
  if (match) {
    const amount = parseInt(match[1]);
    const unit = match[2];
    
    if (unit === "m") {
      return new Date(now.getTime() - amount * 60 * 1000);
    } else if (unit === "h") {
      return new Date(now.getTime() - amount * 60 * 60 * 1000);
    } else if (unit === "d") {
      return new Date(now.getTime() - amount * 24 * 60 * 60 * 1000);
    }
  }
  
  // Handle specific dates like "2025-11-18"
  const date = new Date(filter);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  return null;
}

function readLogFiles(logsDir: string, sinceTime?: Date): LogEntry[] {
  if (!existsSync(logsDir)) {
    console.error(`\n❌ Logs directory not found: ${logsDir}`);
    console.log("\n📍 Log locations:");
    console.log("   Local dev: Logs are in ./logs/ (run 'mkdir logs' if missing)");
    console.log("   Vercel prod: https://vercel.com/your-project/logs");
    console.log("   Terminal: Check output of 'bun run dev'\n");
    return [];
  }

  const logFiles = readdirSync(logsDir).filter(
    (f) => f.endsWith(".log") || f.endsWith(".json")
  );

  if (logFiles.length === 0) {
    console.log("\n📁 No log files found in ./logs/");
    console.log("   Logs will appear after you run the app and actions occur.\n");
    return [];
  }

  const allEntries: LogEntry[] = [];

  for (const file of logFiles) {
    try {
      const content = readFileSync(join(logsDir, file), "utf-8");
      const lines = content.split("\n").filter((l) => l.trim());

      for (const line of lines) {
        try {
          const entry = JSON.parse(line) as LogEntry;
          
          // Filter by time if specified
          if (sinceTime && entry.time) {
            const entryTime = new Date(entry.time);
            if (entryTime < sinceTime) continue;
          }
          
          allEntries.push(entry);
        } catch {
          // Skip malformed JSON lines
        }
      }
    } catch (err) {
      console.warn(`⚠️  Could not read log file: ${file}`);
    }
  }

  return allEntries;
}

function analyzeLogs(entries: LogEntry[]): ErrorSummary {
  const errors = entries.filter((e) => e.level === "error");
  const warnings = entries.filter((e) => e.level === "warn");

  // Group errors by message pattern
  const errorGroups = new Map<string, ErrorGroup>();

  for (const error of errors) {
    const pattern = error.msg || "Unknown error";
    
    if (!errorGroups.has(pattern)) {
      errorGroups.set(pattern, {
        count: 0,
        firstSeen: error.time,
        lastSeen: error.time,
        affectedUsers: new Set(),
        affectedRoutes: new Set(),
        example: error,
      });
    }

    const group = errorGroups.get(pattern)!;
    group.count++;
    group.lastSeen = error.time;
    
    // Track affected users and routes
    const userId = error.userId as string | undefined;
    const email = (error.email || error.attemptedEmail) as string | undefined;
    if (userId) group.affectedUsers.add(userId);
    if (email) group.affectedUsers.add(email);
    if (error.route) group.affectedRoutes.add(error.route as string);
  }

  // Sort by count (most frequent first)
  const criticalIssues = Array.from(errorGroups.entries())
    .map(([issue, data]) => ({
      issue,
      count: data.count,
      firstSeen: data.firstSeen,
      lastSeen: data.lastSeen,
      affectedUsers: data.affectedUsers,
      affectedRoutes: data.affectedRoutes,
      exampleError: data.example,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Auth failures analysis
  const authFailures = entries.filter(
    (e) =>
      (e.msg?.toLowerCase().includes("login") ||
       e.msg?.toLowerCase().includes("auth")) &&
      (e.level === "error" || e.level === "warn")
  );
  
  const authReasons: Record<string, number> = {};
  for (const failure of authFailures) {
    const reason = failure.msg || "Unknown auth failure";
    authReasons[reason] = (authReasons[reason] || 0) + 1;
  }

  // API errors analysis
  const apiErrors = entries.filter(
    (e) => e.route && (e.level === "error" || e.level === "warn")
  );
  
  const routeErrors: Record<string, number> = {};
  let count5xx = 0;
  let count4xx = 0;
  
  for (const error of apiErrors) {
    const route = error.route as string || "Unknown route";
    routeErrors[route] = (routeErrors[route] || 0) + 1;
    
    // Try to determine status code
    const errorMsg = error.error?.message || error.msg || "";
    const statusMatch = errorMsg.match(/(\d{3})/);
    if (statusMatch) {
      const status = parseInt(statusMatch[0]);
      if (status >= 500) count5xx++;
      else if (status >= 400) count4xx++;
    }
  }

  // Generate actionable recommendations
  const recommendations: string[] = [];
  
  // Check for auth issues
  if (authFailures.length > 10) {
    const userNotFoundCount = authReasons["Login failed: user not found"] || 0;
    const noPasswordCount = authReasons["Login failed: user has no password hash"] || 0;
    const wrongPasswordCount = authReasons["Login failed: incorrect password"] || 0;
    
    if (noPasswordCount > 0) {
      recommendations.push(
        `🔴 CRITICAL: ${noPasswordCount} login attempts failed because user has no password hash. ` +
        `Fix: Run 'bun run scripts/create-admin.ts' to recreate admin account with password.`
      );
    }
    
    if (userNotFoundCount > 5) {
      recommendations.push(
        `⚠️  ${userNotFoundCount} login attempts for non-existent users. ` +
        `Action: Create admin account with 'bun run scripts/create-admin.ts'`
      );
    }
    
    if (wrongPasswordCount > 10) {
      recommendations.push(
        `⚠️  ${wrongPasswordCount} incorrect password attempts. ` +
        `Possible brute force attack or user forgot password.`
      );
    }
  }
  
  // Check for server errors
  if (count5xx > 5) {
    recommendations.push(
      `🔴 ${count5xx} server errors (5xx). Common causes:`,
      `   1. Database connection issues (check DATABASE_URL)`,
      `   2. External API timeouts (ImageKit, Stripe, Resend)`,
      `   3. Missing environment variables (check .env.local)`,
      `   4. Prisma schema mismatch (run 'bun x prisma db push')`
    );
  }
  
  // Check for top issues
  if (criticalIssues.length > 0 && criticalIssues[0].count > 5) {
    const top = criticalIssues[0];
    recommendations.push(
      `🔥 Most common error: "${top.issue}" occurred ${top.count} times. ` +
      `Affects ${top.affectedRoutes.size} routes and ${top.affectedUsers.size} users.`
    );
  }
  
  // Check for database issues
  const dbErrors = errors.filter(e => 
    e.msg?.toLowerCase().includes("database") ||
    e.msg?.toLowerCase().includes("prisma")
  );
  if (dbErrors.length > 5) {
    recommendations.push(
      `🔴 ${dbErrors.length} database errors detected. Check:`,
      `   1. DATABASE_URL is correct in .env.local`,
      `   2. Supabase database is running`,
      `   3. Run 'bun x prisma db push' to sync schema`
    );
  }

  // Determine analysis period
  const now = new Date();
  const oldestEntry = entries.length > 0 
    ? entries.sort((a, b) => 
        new Date(a.time).getTime() - new Date(b.time).getTime()
      )[0]
    : null;
  const period = oldestEntry 
    ? `${oldestEntry.time} to ${now.toISOString()}`
    : "No entries found";

  return {
    timestamp: now.toISOString(),
    totalErrors: errors.length,
    totalWarnings: warnings.length,
    period,
    criticalIssues,
    authFailures: {
      total: authFailures.length,
      byReason: authReasons,
      examples: authFailures.slice(0, 5),
    },
    apiErrors: {
      total: apiErrors.length,
      by5xx: count5xx,
      by4xx: count4xx,
      byRoute: routeErrors,
      examples: apiErrors.slice(0, 5),
    },
    recommendations,
  };
}

function formatSummaryForAI(summary: ErrorSummary): string {
  let output = `# ERROR SUMMARY FOR AI ASSISTANT\n\n`;
  output += `**Generated:** ${summary.timestamp}\n`;
  output += `**Analysis Period:** ${summary.period}\n\n`;
  output += `---\n\n`;

  // Overview
  output += `## 📊 OVERVIEW\n\n`;
  output += `- **Total Errors:** ${summary.totalErrors}\n`;
  output += `- **Total Warnings:** ${summary.totalWarnings}\n`;
  output += `- **Status:** ${summary.totalErrors === 0 ? "✅ No errors" : `⚠️  ${summary.totalErrors} errors need attention`}\n\n`;

  // Critical recommendations
  if (summary.recommendations.length > 0) {
    output += `## 🚨 CRITICAL RECOMMENDATIONS\n\n`;
    summary.recommendations.forEach((rec) => {
      output += `${rec}\n\n`;
    });
    output += `---\n\n`;
  }

  // Top issues
  if (summary.criticalIssues.length > 0) {
    output += `## 🔥 TOP ISSUES (By Frequency)\n\n`;
    summary.criticalIssues.forEach((issue, i) => {
      output += `### ${i + 1}. ${issue.issue}\n\n`;
      output += `- **Occurrences:** ${issue.count}\n`;
      output += `- **First Seen:** ${issue.firstSeen}\n`;
      output += `- **Last Seen:** ${issue.lastSeen}\n`;
      output += `- **Affected Users/Emails:** ${issue.affectedUsers.size}\n`;
      output += `- **Affected Routes:** ${issue.affectedRoutes.size > 0 ? Array.from(issue.affectedRoutes).join(", ") : "N/A"}\n\n`;
      output += `**Example Error:**\n\n\`\`\`json\n${JSON.stringify(issue.exampleError, null, 2)}\n\`\`\`\n\n`;
    });
    output += `---\n\n`;
  }

  // Auth failures
  if (summary.authFailures.total > 0) {
    output += `## 🔐 AUTHENTICATION FAILURES\n\n`;
    output += `**Total:** ${summary.authFailures.total}\n\n`;
    output += `**Breakdown by Reason:**\n\n`;
    
    const sortedReasons = Object.entries(summary.authFailures.byReason)
      .sort((a, b) => b[1] - a[1]);
    
    sortedReasons.forEach(([reason, count]) => {
      output += `- ${reason}: **${count}**\n`;
    });
    
    if (summary.authFailures.examples.length > 0) {
      output += `\n**Example Auth Failures:**\n\n\`\`\`json\n${JSON.stringify(summary.authFailures.examples, null, 2)}\n\`\`\`\n\n`;
    }
    output += `---\n\n`;
  }

  // API errors
  if (summary.apiErrors.total > 0) {
    output += `## 🌐 API ERRORS\n\n`;
    output += `- **Total API Errors:** ${summary.apiErrors.total}\n`;
    output += `- **5xx (Server Errors):** ${summary.apiErrors.by5xx}\n`;
    output += `- **4xx (Client Errors):** ${summary.apiErrors.by4xx}\n\n`;
    
    output += `**Errors by Route:**\n\n`;
    Object.entries(summary.apiErrors.byRoute)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([route, count]) => {
        output += `- ${route}: **${count}**\n`;
      });
    
    if (summary.apiErrors.examples.length > 0) {
      output += `\n**Example API Errors:**\n\n\`\`\`json\n${JSON.stringify(summary.apiErrors.examples, null, 2)}\n\`\`\`\n\n`;
    }
    output += `---\n\n`;
  }

  // Instructions for AI
  output += `## 🤖 INSTRUCTIONS FOR AI ASSISTANT\n\n`;
  output += `This summary provides comprehensive context about application errors. Use it to:\n\n`;
  output += `1. **Identify Root Causes:** Look for patterns in error messages and affected components\n`;
  output += `2. **Prioritize Fixes:** Focus on issues with highest occurrence count first\n`;
  output += `3. **Suggest Specific Fixes:** Provide code changes for common patterns\n`;
  output += `4. **Verify Impact:** Consider affected user count and route diversity\n\n`;
  
  output += `### Project Context\n\n`;
  output += `- **Framework:** Next.js 14 (App Router)\n`;
  output += `- **Auth:** NextAuth with credentials provider\n`;
  output += `- **Database:** Prisma ORM + Supabase PostgreSQL\n`;
  output += `- **Deployment:** Vercel\n`;
  output += `- **Language:** TypeScript\n\n`;
  
  output += `### Key File Locations\n\n`;
  output += `- Auth config: \`src/lib/auth.ts\`\n`;
  output += `- Logger: \`src/lib/logger.ts\`\n`;
  output += `- API routes: \`src/app/api/**\`\n`;
  output += `- Database schema: \`prisma/schema.prisma\`\n`;
  output += `- Environment: \`.env.local\` (never commit)\n\n`;
  
  output += `### Common Fix Patterns\n\n`;
  output += `**For "Login failed: user not found":**\n`;
  output += `\`\`\`bash\n`;
  output += `bun run scripts/create-admin.ts\n`;
  output += `\`\`\`\n\n`;
  
  output += `**For "Login failed: user has no password hash":**\n`;
  output += `\`\`\`bash\n`;
  output += `bun run scripts/create-admin.ts\n`;
  output += `\`\`\`\n\n`;
  
  output += `**For database connection errors:**\n`;
  output += `\`\`\`bash\n`;
  output += `# Check environment variable\n`;
  output += `echo $DATABASE_URL\n`;
  output += `# Sync database schema\n`;
  output += `bun x prisma db push\n`;
  output += `\`\`\`\n\n`;
  
  output += `**For NextAuth errors:**\n`;
  output += `\`\`\`bash\n`;
  output += `# Verify environment variables\n`;
  output += `echo $NEXTAUTH_SECRET\n`;
  output += `echo $NEXTAUTH_URL\n`;
  output += `\`\`\`\n\n`;

  output += `---\n\n`;
  output += `*Generated by Kollect-It Error Summary System*\n`;
  output += `*Run \`bun run error-summary\` to regenerate after fixes*\n`;

  return output;
}

function main() {
  console.log(`\n🔍 Kollect-It Error Summary Generator\n`);
  console.log(`=`.repeat(50));
  
  const args = process.argv.slice(2);
  const timeArg = args.find((a) => a.startsWith("--last=") || a.startsWith("--date="));
  
  let sinceTime: Date | undefined;
  if (timeArg) {
    const value = timeArg.split("=")[1];
    const parsed = parseTimeFilter(value);
    if (parsed) {
      sinceTime = parsed;
      console.log(`\n📅 Analyzing logs since: ${sinceTime.toISOString()}`);
    } else {
      console.log(`\n⚠️  Invalid time filter: ${value}`);
      console.log(`   Valid formats: --last=1h, --last=30m, --last=2d, --date=2025-11-18\n`);
      return;
    }
  } else {
    console.log(`\n📅 Analyzing all available logs`);
  }

  const logsDir = join(process.cwd(), "logs");
  const entries = readLogFiles(logsDir, sinceTime);

  if (entries.length === 0) {
    console.log(`\n✅ No errors or warnings found!`);
    console.log(`\nIf you expected logs, check:`);
    console.log(`   1. Is the app running? (bun run dev)`);
    console.log(`   2. Have any actions occurred? (Try logging in, etc.)`);
    console.log(`   3. Check console output in terminal\n`);
    return;
  }

  console.log(`\n📊 Processing ${entries.length} log entries...\n`);

  const summary = analyzeLogs(entries);
  const aiOutput = formatSummaryForAI(summary);

  // Save to file
  const outputPath = join(process.cwd(), "error-summary-ai.md");
  writeFileSync(outputPath, aiOutput, "utf-8");

  // Print summary to console
  console.log(`=`.repeat(50));
  console.log(`\n✅ AI-ready error summary generated!`);
  console.log(`\n📄 File: ${outputPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Total Errors: ${summary.totalErrors}`);
  console.log(`   - Total Warnings: ${summary.totalWarnings}`);
  console.log(`   - Critical Issues: ${summary.criticalIssues.length}`);
  console.log(`   - Auth Failures: ${summary.authFailures.total}`);
  console.log(`   - API Errors: ${summary.apiErrors.total}\n`);

  if (summary.recommendations.length > 0) {
    console.log(`🚨 Critical Recommendations:`);
    summary.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec.substring(0, 80)}${rec.length > 80 ? "..." : ""}`);
    });
    console.log(``);
  }

  console.log(`💡 Next Steps:`);
  console.log(`   1. Review the full summary: ${outputPath}`);
  console.log(`   2. Share with Claude or VS Code AI agent`);
  console.log(`   3. Apply suggested fixes`);
  console.log(`   4. Run 'bun run error-summary' again to verify\n`);
  console.log(`=`.repeat(50));
  console.log(``);
}

main();
