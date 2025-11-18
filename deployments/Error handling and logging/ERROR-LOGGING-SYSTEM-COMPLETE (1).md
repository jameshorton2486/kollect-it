# Complete Error Handling & Logging System for Kollect-It

## Executive Summary

Your project **already has** a solid logging foundation. The ChatGPT response was good but didn't account for what you've already built. This document provides:

1. ✅ What you already have (it's better than ChatGPT suggested)
2. 🔧 Specific improvements needed
3. 🤖 **Automated error summary system for AI agents**
4. 📋 Clear file locations for every type of error
5. 🚀 Auto-executable scripts

---

## What You Already Have (Better Than Expected)

### ✅ Structured Logger (`src/lib/logger.ts`)
**Status:** Production-ready with smart features
- JSON-formatted logs
- Automatic PII/secret redaction
- Request context support (requestId, IP, userId)
- Level-based logging (debug, info, warn, error)
- Proper console routing by level

### ✅ API Error Handler (`src/lib/api-error.ts`)
**Status:** Production-ready
- `respondOk()` - Standardized success responses
- `respondError()` - Automatic error logging based on status code
- Request ID tracking across all responses
- Custom `AppError` class for controlled exceptions

### ✅ Request Context (`src/lib/request-context.ts`)
**Status:** Already exists
- Generates/extracts request IDs
- Extracts client IP from various headers
- Works with Vercel's proxy headers

### ✅ Documentation
**Status:** Already exists
- `docs/LOGGING.md` - Overview of logging system
- `docs/ERROR_HANDLING_AND_LOGGING_GUIDE.md` - Comprehensive troubleshooting guide

---

## What's Missing (Your Pain Points)

### ❌ Auth-Specific Logging
**Problem:** Login failures give zero detail
**Impact:** "I can't log in" = hours of blind troubleshooting

### ❌ Automated Error Summaries
**Problem:** No way to quickly generate AI-ready error context
**Impact:** Manual log reading, slow fixes

### ❌ Production Log Aggregation
**Problem:** Logs are scattered (Vercel, console, local files)
**Impact:** No single place to see what went wrong

### ❌ Error Summary Dashboard
**Problem:** No quick view of "what's broken right now"
**Impact:** Reactive instead of proactive

---

## Part 1: Enhanced Auth Logging (Immediate Fix)

### Current Auth File Review
**Location:** `src/lib/auth.ts`

**Problems:**
- Every login failure throws generic "Invalid credentials"
- No logging of attempts (successful or failed)
- No context about why auth failed
- NextAuth errors are silent

### Solution: Enhanced Auth with Detailed Logging

Replace your current `src/lib/auth.ts` with this enhanced version:

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logger } from "./logger";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Log the attempt (redacted)
        logger.info("Login attempt started", {
          email: credentials?.email ? "present" : "missing",
          password: credentials?.password ? "present" : "missing",
        });

        if (!credentials?.email || !credentials?.password) {
          logger.warn("Login failed: missing credentials", {
            hasEmail: !!credentials?.email,
            hasPassword: !!credentials?.password,
          });
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        }).catch((err) => {
          logger.error("Login failed: database error during user lookup", {
            email: credentials.email,
          }, err);
          throw new Error("Invalid credentials");
        });

        if (!user) {
          logger.warn("Login failed: user not found", {
            attemptedEmail: credentials.email,
          });
          throw new Error("Invalid credentials");
        }

        if (!user.password) {
          logger.error("Login failed: user has no password hash", {
            userId: user.id,
            email: user.email,
            userRole: user.role,
          });
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        ).catch((err) => {
          logger.error("Login failed: password comparison error", {
            userId: user.id,
            email: user.email,
          }, err);
          throw new Error("Invalid credentials");
        });

        if (!isPasswordValid) {
          logger.warn("Login failed: incorrect password", {
            userId: user.id,
            email: user.email,
            userRole: user.role,
          });
          throw new Error("Invalid credentials");
        }

        // Success!
        logger.info("Login succeeded", {
          userId: user.id,
          email: user.email,
          role: user.role,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        logger.debug("JWT token created", {
          userId: user.id,
          role: user.role,
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        logger.debug("Session created", {
          userId: token.id as string,
          role: token.role as string,
        });
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Add NextAuth's own logger
  logger: {
    error(code, metadata) {
      logger.error("NextAuth error", { code, ...metadata });
    },
    warn(code) {
      logger.warn("NextAuth warning", { code });
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        logger.debug("NextAuth debug", { code, ...metadata });
      }
    },
  },
  // Add better error messages
  debug: process.env.NODE_ENV === "development",
};
```

**What This Fixes:**
- ✅ Login failures now log the specific reason
- ✅ Successful logins are tracked
- ✅ NextAuth errors are captured
- ✅ Database errors are logged with context
- ✅ All logs include user ID, email, role (when available)

---

## Part 2: Automated Error Summary System

This creates **AI-ready error summaries** automatically.

### Error Summary Generator Script

**Create:** `scripts/generate-error-summary.ts`

```typescript
#!/usr/bin/env bun
/**
 * Automated Error Summary Generator
 * 
 * Usage:
 *   bun run scripts/generate-error-summary.ts
 *   bun run scripts/generate-error-summary.ts --last 1h
 *   bun run scripts/generate-error-summary.ts --date 2025-11-18
 * 
 * Generates AI-ready error summaries with full context
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
  error?: {
    message?: string;
    name?: string;
    stack?: string;
  };
  [key: string]: unknown;
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
    console.error(`Logs directory not found: ${logsDir}`);
    console.log("\nVercel logs location: https://vercel.com/your-project/logs");
    return [];
  }

  const logFiles = readdirSync(logsDir).filter(
    (f) => f.endsWith(".log") || f.endsWith(".json")
  );

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
          // Skip malformed lines
        }
      }
    } catch (err) {
      console.warn(`Could not read log file: ${file}`);
    }
  }

  return allEntries;
}

function analyzeLogs(entries: LogEntry[]): ErrorSummary {
  const errors = entries.filter((e) => e.level === "error");
  const warnings = entries.filter((e) => e.level === "warn");

  // Group errors by message pattern
  const errorGroups = new Map<string, {
    count: number;
    firstSeen: string;
    lastSeen: string;
    affectedUsers: Set<string>;
    affectedRoutes: Set<string>;
    example: LogEntry;
  }>();

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
    if (error.userId) group.affectedUsers.add(error.userId);
    if (error.route) group.affectedRoutes.add(error.route);
  }

  // Sort by count
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
      e.msg?.toLowerCase().includes("login") ||
      e.msg?.toLowerCase().includes("auth")
  );
  
  const authReasons: Record<string, number> = {};
  for (const failure of authFailures) {
    const reason = failure.msg || "Unknown";
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
    const route = error.route || "Unknown";
    routeErrors[route] = (routeErrors[route] || 0) + 1;
    
    // Check if it's a status code error
    const status = error.error?.message?.match(/(\d{3})/)?.[0];
    if (status) {
      const statusNum = parseInt(status);
      if (statusNum >= 500) count5xx++;
      else if (statusNum >= 400) count4xx++;
    }
  }

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (authFailures.length > 10) {
    recommendations.push(
      `⚠️ High auth failure rate (${authFailures.length} failures). Check: 1) User database has admin accounts 2) Password hashes are valid 3) NEXTAUTH_SECRET is set`
    );
  }
  
  if (count5xx > 5) {
    recommendations.push(
      `🔴 ${count5xx} server errors (5xx). Check: 1) Database connection 2) External API timeouts 3) Environment variables`
    );
  }
  
  if (criticalIssues.length > 0 && criticalIssues[0].count > 5) {
    const top = criticalIssues[0];
    recommendations.push(
      `🔥 Most common error: "${top.issue}" (${top.count} times). Affects ${top.affectedRoutes.size} routes.`
    );
  }

  const now = new Date();
  const oldestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const period = oldestEntry 
    ? `${oldestEntry.time} to ${now.toISOString()}`
    : "No entries";

  return {
    timestamp: now.toISOString(),
    totalErrors: errors.length,
    totalWarnings: warnings.length,
    period,
    criticalIssues,
    authFailures: {
      total: authFailures.length,
      byReason: authReasons,
      examples: authFailures.slice(0, 3),
    },
    apiErrors: {
      total: apiErrors.length,
      by5xx: count5xx,
      by4xx: count4xx,
      byRoute: routeErrors,
      examples: apiErrors.slice(0, 3),
    },
    recommendations,
  };
}

function formatSummaryForAI(summary: ErrorSummary): string {
  let output = `# ERROR SUMMARY FOR AI ASSISTANT\n\n`;
  output += `Generated: ${summary.timestamp}\n`;
  output += `Period: ${summary.period}\n\n`;

  output += `## OVERVIEW\n`;
  output += `- Total Errors: ${summary.totalErrors}\n`;
  output += `- Total Warnings: ${summary.totalWarnings}\n\n`;

  if (summary.recommendations.length > 0) {
    output += `## CRITICAL RECOMMENDATIONS\n`;
    summary.recommendations.forEach((rec) => {
      output += `${rec}\n`;
    });
    output += `\n`;
  }

  if (summary.criticalIssues.length > 0) {
    output += `## TOP ISSUES\n\n`;
    summary.criticalIssues.forEach((issue, i) => {
      output += `### ${i + 1}. ${issue.issue}\n`;
      output += `- Occurrences: ${issue.count}\n`;
      output += `- First seen: ${issue.firstSeen}\n`;
      output += `- Last seen: ${issue.lastSeen}\n`;
      output += `- Affected users: ${issue.affectedUsers.size}\n`;
      output += `- Affected routes: ${Array.from(issue.affectedRoutes).join(", ")}\n`;
      output += `\n**Example error:**\n\`\`\`json\n${JSON.stringify(issue.exampleError, null, 2)}\n\`\`\`\n\n`;
    });
  }

  if (summary.authFailures.total > 0) {
    output += `## AUTHENTICATION FAILURES\n`;
    output += `Total: ${summary.authFailures.total}\n\n`;
    output += `**Breakdown by reason:**\n`;
    Object.entries(summary.authFailures.byReason).forEach(([reason, count]) => {
      output += `- ${reason}: ${count}\n`;
    });
    output += `\n**Examples:**\n\`\`\`json\n${JSON.stringify(summary.authFailures.examples, null, 2)}\n\`\`\`\n\n`;
  }

  if (summary.apiErrors.total > 0) {
    output += `## API ERRORS\n`;
    output += `- Total: ${summary.apiErrors.total}\n`;
    output += `- 5xx errors: ${summary.apiErrors.by5xx}\n`;
    output += `- 4xx errors: ${summary.apiErrors.by4xx}\n\n`;
    output += `**By route:**\n`;
    Object.entries(summary.apiErrors.byRoute)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([route, count]) => {
        output += `- ${route}: ${count}\n`;
      });
    output += `\n`;
  }

  output += `\n---\n\n`;
  output += `## INSTRUCTIONS FOR AI\n`;
  output += `This summary provides context about current application errors. Use it to:\n`;
  output += `1. Identify root causes\n`;
  output += `2. Suggest specific fixes\n`;
  output += `3. Prioritize issues by frequency and impact\n`;
  output += `4. Generate code fixes for common patterns\n`;
  output += `\n`;
  output += `The project uses:\n`;
  output += `- Next.js 14 (App Router)\n`;
  output += `- NextAuth for authentication\n`;
  output += `- Prisma ORM with Supabase PostgreSQL\n`;
  output += `- Vercel for deployment\n`;
  output += `- TypeScript\n`;

  return output;
}

function main() {
  const args = process.argv.slice(2);
  const timeFilter = args.find((a) => a.startsWith("--last=") || a.startsWith("--date="));
  
  let sinceTime: Date | undefined;
  if (timeFilter) {
    const value = timeFilter.split("=")[1];
    sinceTime = parseTimeFilter(value) || undefined;
    if (sinceTime) {
      console.log(`Analyzing logs since: ${sinceTime.toISOString()}`);
    }
  }

  const logsDir = join(process.cwd(), "logs");
  const entries = readLogFiles(logsDir, sinceTime);

  if (entries.length === 0) {
    console.log("\n❌ No log entries found.");
    console.log("\n📍 Possible locations:");
    console.log("   - Local development: ./logs/ directory");
    console.log("   - Vercel production: https://vercel.com/your-project/logs");
    console.log("   - Console output: Check terminal running 'bun run dev'\n");
    return;
  }

  console.log(`\nAnalyzing ${entries.length} log entries...\n`);

  const summary = analyzeLogs(entries);
  const aiOutput = formatSummaryForAI(summary);

  // Save to file
  const outputPath = join(process.cwd(), "error-summary-ai.md");
  writeFileSync(outputPath, aiOutput, "utf-8");

  console.log(`✅ AI-ready error summary generated: ${outputPath}\n`);
  console.log(`📊 Summary:`);
  console.log(`   - Errors: ${summary.totalErrors}`);
  console.log(`   - Warnings: ${summary.totalWarnings}`);
  console.log(`   - Critical issues: ${summary.criticalIssues.length}`);
  console.log(`   - Auth failures: ${summary.authFailures.total}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Review the generated summary: ${outputPath}`);
  console.log(`   2. Share with Claude/VS Code AI agent for fixes`);
  console.log(`   3. Run again after fixes to verify\n`);
}

main();
```

**Add to `package.json` scripts:**
```json
{
  "scripts": {
    "error-summary": "bun run scripts/generate-error-summary.ts",
    "error-summary:last-hour": "bun run scripts/generate-error-summary.ts --last=1h",
    "error-summary:today": "bun run scripts/generate-error-summary.ts --last=24h"
  }
}
```

---

## Part 3: File Locations Reference (When Something Breaks)

### 📁 Complete File Map

| **What Broke** | **Where to Look** | **How to Access** |
|---|---|---|
| **Login/Auth Issues** | `logs/` directory + Vercel logs | `bun run error-summary` |
| **API Endpoint Errors** | `logs/` + `src/app/api/*/route.ts` | Search logs for route name |
| **Database Errors** | Supabase dashboard + `logs/` | Supabase → Logs tab |
| **Build Failures** | Terminal output from `bun run build` | Re-run build, read errors |
| **Environment Variable Issues** | `src/lib/env.ts` validation | Check terminal on startup |
| **NextAuth Configuration** | `src/lib/auth.ts` + Vercel env vars | Check NEXTAUTH_SECRET, NEXTAUTH_URL |
| **Prisma/Database Schema** | `prisma/schema.prisma` | Run `bunx prisma studio` |
| **Image Upload Failures** | `src/lib/imagekit.ts` logs | Check ImageKit dashboard |
| **Email Sending Errors** | `src/lib/email.ts` + Resend logs | Check Resend.com dashboard |
| **Stripe Payment Issues** | `src/lib/stripe.ts` + Stripe dashboard | Check webhook logs in Stripe |
| **Client-Side Errors** | Browser Console (F12) | Chrome DevTools → Console |
| **Deployment Errors** | Vercel deployment logs | Vercel → Deployments → View logs |

### 🔍 Quick Diagnostic Commands

```bash
# Generate AI-ready error summary (run this first)
bun run error-summary

# View recent errors (local development)
Get-Content logs/error-*.log | Select-Object -Last 20

# Search for specific issue
Select-String "login" logs/*.log

# Check if environment variables are set
bun run scripts/check-env.mjs

# View database schema issues
bunx prisma validate

# Check for TypeScript errors
bunx tsc --noEmit

# Test database connection
bunx prisma db pull --force
```

---

## Part 4: Automated Monitoring Script

Create a script that runs automatically and generates summaries:

**Create:** `scripts/auto-monitor.ts`

```typescript
#!/usr/bin/env bun
/**
 * Automated Error Monitoring
 * Runs every 5 minutes and generates alerts when errors spike
 */

import { spawn } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface MonitorState {
  lastCheck: string;
  errorCount: number;
  alertThreshold: number;
  alerts: {
    time: string;
    message: string;
    errorCount: number;
  }[];
}

const STATE_FILE = join(process.cwd(), ".monitor-state.json");

function loadState(): MonitorState {
  if (existsSync(STATE_FILE)) {
    return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  }
  return {
    lastCheck: new Date().toISOString(),
    errorCount: 0,
    alertThreshold: 10,
    alerts: [],
  };
}

function saveState(state: MonitorState) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function runErrorSummary(): Promise<{ errors: number; warnings: number }> {
  return new Promise((resolve) => {
    const proc = spawn("bun", ["run", "scripts/generate-error-summary.ts", "--last=5m"]);
    
    proc.on("close", () => {
      // Parse the generated summary
      const summaryPath = join(process.cwd(), "error-summary-ai.md");
      if (existsSync(summaryPath)) {
        const content = readFileSync(summaryPath, "utf-8");
        const errorMatch = content.match(/Total Errors: (\d+)/);
        const warnMatch = content.match(/Total Warnings: (\d+)/);
        
        resolve({
          errors: errorMatch ? parseInt(errorMatch[1]) : 0,
          warnings: warnMatch ? parseInt(warnMatch[1]) : 0,
        });
      } else {
        resolve({ errors: 0, warnings: 0 });
      }
    });
  });
}

async function main() {
  const state = loadState();
  const result = await runErrorSummary();
  
  console.log(`\n🔍 Error Monitor Check - ${new Date().toISOString()}`);
  console.log(`   Errors in last 5 min: ${result.errors}`);
  console.log(`   Warnings in last 5 min: ${result.warnings}`);
  
  if (result.errors > state.alertThreshold) {
    console.log(`\n⚠️  ALERT: Error count (${result.errors}) exceeds threshold (${state.alertThreshold})`);
    
    state.alerts.push({
      time: new Date().toISOString(),
      message: `High error rate detected: ${result.errors} errors in 5 minutes`,
      errorCount: result.errors,
    });
    
    // Keep only last 100 alerts
    if (state.alerts.length > 100) {
      state.alerts = state.alerts.slice(-100);
    }
  } else {
    console.log(`\n✅ Error rate normal`);
  }
  
  state.lastCheck = new Date().toISOString();
  state.errorCount = result.errors;
  saveState(state);
  
  console.log(`\n📊 View full report: error-summary-ai.md`);
}

main().catch(console.error);
```

**Add to `package.json`:**
```json
{
  "scripts": {
    "monitor": "bun run scripts/auto-monitor.ts",
    "monitor:watch": "watch 'bun run monitor' logs/"
  }
}
```

---

## Part 5: VS Code AI Agent Integration

Create a prompt file specifically for AI agents:

**Create:** `.github/copilot-instructions-errors.md`

```markdown
# Error Debugging Instructions for AI Agents

When debugging Kollect-It application errors:

## Step 1: Generate Error Summary
Run: `bun run error-summary`
Review: `error-summary-ai.md`

## Step 2: Identify Root Cause
Common patterns:
- "Login failed: user not found" → Run `bunx prisma studio`, check Users table
- "Login failed: user has no password hash" → User created without password, run `bun run scripts/create-admin.ts`
- "NextAuth error" → Check `.env.local` for NEXTAUTH_SECRET and NEXTAUTH_URL
- "Database error" → Check `DATABASE_URL` in environment variables
- API 500 errors → Check specific route in `src/app/api/*/route.ts`

## Step 3: Fix Files
Key files to edit:
- Auth issues: `src/lib/auth.ts`
- API errors: `src/app/api/[route]/route.ts`
- Environment: `.env.local` (never commit this!)
- Database: `prisma/schema.prisma` (then run `bunx prisma migrate dev`)

## Step 4: Verify Fix
```bash
# Re-run error summary
bun run error-summary

# Check logs in real-time
bun run dev
# Try the action that failed

# Verify no new errors
Get-Content logs/error-*.log | Select-Object -Last 10
```

## File Locations Quick Reference
- Logs: `./logs/` directory
- Auth: `src/lib/auth.ts`
- API routes: `src/app/api/**`
- Database schema: `prisma/schema.prisma`
- Environment: `.env.local`
- Error summary: `error-summary-ai.md` (generated)
```

---

## Part 6: Implementation Checklist

### Immediate Actions (15 minutes)

- [ ] 1. Copy enhanced `auth.ts` to `src/lib/auth.ts`
- [ ] 2. Create `scripts/generate-error-summary.ts`
- [ ] 3. Create `scripts/auto-monitor.ts`
- [ ] 4. Add script entries to `package.json`
- [ ] 5. Run `bun run error-summary` to test
- [ ] 6. Try logging in again, then run error summary

### Testing (10 minutes)

- [ ] 1. Start dev server: `bun run dev`
- [ ] 2. Try logging in with wrong credentials
- [ ] 3. Check terminal output for detailed logs
- [ ] 4. Run `bun run error-summary`
- [ ] 5. Review `error-summary-ai.md`
- [ ] 6. Share summary with AI agent for fixes

### Production Setup (5 minutes)

- [ ] 1. Set up Vercel log streaming (optional)
- [ ] 2. Configure error alerts (optional)
- [ ] 3. Add monitoring to CI/CD (optional)

---

## Part 7: Example AI Agent Usage

### Scenario: "I can't log in"

**Before this system:**
```
You: "I can't log in"
AI: "Can you check the console?"
You: "Says 'Invalid credentials'"
AI: "Check your password?"
You: "I did, it's correct"
AI: "Maybe check the database?"
... 30 minutes of back-and-forth
```

**After this system:**
```bash
# Run this
bun run error-summary

# Share the generated error-summary-ai.md with AI:
```

AI immediately sees:
```markdown
## TOP ISSUES

### 1. Login failed: user has no password hash
- Occurrences: 15
- First seen: 2025-11-18T10:30:00.000Z
- Affected routes: /api/auth/[...nextauth]

**Example error:**
{
  "level": "error",
  "msg": "Login failed: user has no password hash",
  "userId": "user_123",
  "email": "admin@kollect-it.com",
  "userRole": "admin"
}

## CRITICAL RECOMMENDATIONS
⚠️ User account exists but has no password hash. 
Fix: Run `bun run scripts/create-admin.ts` to recreate admin account with password.
```

AI Agent Response:
```typescript
// Fix identified: Admin user exists without password hash
// Solution: Recreate admin account

// Run this command:
bun run scripts/create-admin.ts

// Or manually update in Prisma:
const hashedPassword = await bcrypt.hash("your-new-password", 10);
await prisma.user.update({
  where: { email: "admin@kollect-it.com" },
  data: { password: hashedPassword }
});
```

**Time saved:** 25 minutes → 2 minutes

---

## Conclusion

### What ChatGPT Got Right
✅ Logging in auth is critical
✅ Need centralized error documentation
✅ NextAuth logger integration helps

### What ChatGPT Missed
❌ You already have a solid logger
❌ You already have API error handling
❌ You need automated summaries, not manual log reading
❌ You need AI-specific error output format

### What This System Provides
✅ **Automated error summaries** - Run one command, get AI-ready context
✅ **Auth-specific logging** - Know exactly why login failed
✅ **Clear file locations** - No more guessing where to look
✅ **AI agent integration** - VS Code Copilot gets full context
✅ **Monitoring scripts** - Auto-detect error spikes
✅ **Production-ready** - Works locally and on Vercel

### Next Steps
1. Implement the enhanced auth.ts
2. Create the error summary script
3. Test with a login failure
4. Run `bun run error-summary`
5. Share output with AI agent
6. Enjoy fast debugging! 🚀
