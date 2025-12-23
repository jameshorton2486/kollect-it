import fs from "fs";
import path from "path";

/* Enhanced logger with file persistence and error tracking */
export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
}

const REDACT_KEYS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "password",
  "token",
  "secret",
  "apiKey",
  "apikey",
  "accessToken",
  "refreshToken",
  "session",
]);

function redactValue(value: unknown): unknown {
  if (typeof value === "string") {
    // Redact emails (show first char only)
    const emailRegex = /([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g;
    return value.replace(
      emailRegex,
      (_m, user, domain) => `${String(user).slice(0, 1)}***@${domain}`,
    );
  }
  return value;
}

function redact(input: unknown): unknown {
  if (Array.isArray(input)) return input.map(redact);
  if (!input || typeof input !== "object") return redactValue(input);
  
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (REDACT_KEYS.has(k.toLowerCase())) {
      out[k] = "[REDACTED]";
    } else if (typeof v === "object" && v !== null) {
      out[k] = redact(v);
    } else {
      out[k] = redactValue(v);
    }
  }
  return out;
}

// File logging (only in development or if LOG_TO_FILE=true)
const shouldLogToFile = process.env.NODE_ENV === "development" || process.env.LOG_TO_FILE === "true";
const logDir = path.join(process.cwd(), "logs");

function ensureLogDir() {
  if (shouldLogToFile && !fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir, { recursive: true });
    } catch (err) {
      console.error("Failed to create log directory:", err);
    }
  }
}

function writeToFile(entry: LogEntry) {
  if (!shouldLogToFile) return;

  try {
    ensureLogDir();
    const filename = `${entry.level}-${new Date().toISOString().split("T")[0]}.log`;
    const filepath = path.join(logDir, filename);
    const line = JSON.stringify(entry) + "\n";
    fs.appendFileSync(filepath, line, "utf8");
  } catch (err) {
    console.error("Failed to write log file:", err);
  }
}

function write(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: unknown,
) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: context ? (redact(context) as Record<string, unknown>) : undefined,
  };

  if (error) {
    const e = error as Error | undefined;
    entry.error = {
      name: e?.name,
      message: e?.message,
      stack: process.env.NODE_ENV === "development" ? e?.stack : undefined,
    };
  }

  // Console output
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else if (level === "info") console.info(line);
  else console.debug(line);

  // File output
  writeToFile(entry);
}

export const enhancedLogger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    write("debug", message, context),
  
  info: (message: string, context?: Record<string, unknown>) =>
    write("info", message, context),
  
  warn: (message: string, context?: Record<string, unknown>) =>
    write("warn", message, context),
  
  error: (message: string, context?: Record<string, unknown>, error?: unknown) =>
    write("error", message, context, error),

  // Auth-specific logging with detailed tracking
  authAttempt: (email: string, success: boolean, reason?: string, details?: Record<string, unknown>) => {
    write(success ? "info" : "warn", "Authentication attempt", {
      email: redactValue(email),
      success,
      reason,
      ...details,
    });
  },

  authError: (message: string, email: string, error?: unknown, details?: Record<string, unknown>) => {
    write("error", `Auth error: ${message}`, {
      email: redactValue(email),
      errorType: error instanceof Error ? error.name : typeof error,
      ...details,
    }, error);
  },

  // Database operation logging
  dbQuery: (operation: string, table: string, success: boolean, duration?: number) => {
    write("debug", "Database query", {
      operation,
      table,
      success,
      durationMs: duration,
    });
  },

  dbError: (operation: string, table: string, error: unknown) => {
    write("error", `Database error: ${operation} on ${table}`, {
      operation,
      table,
    }, error);
  },
};

export default enhancedLogger;
