/**
 * Environment Variable Validation
 * Validates and provides type-safe access to environment variables
 *
 * This module ensures all required environment variables are present and valid
 * at application startup, preventing runtime errors from missing configuration.
 */

/**
 * Environment variables schema
 */
interface EnvironmentVariables {
  // Application
  NODE_ENV: "development" | "production" | "test";
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;

  // Database
  DATABASE_URL: string;
  DIRECT_URL?: string;

  // ImageKit (Image CDN)
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: string;
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: string;
  IMAGEKIT_PRIVATE_KEY: string;

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;

  // Google OAuth
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;

  // Email (Google Workspace integration pending)
  NEXT_PUBLIC_APP_EMAIL: string;

  // Product ingest API (server-only)
  PRODUCT_INGEST_API_KEY: string;
}

let validatedEnv: Partial<EnvironmentVariables> | null = null;

/**
 * Validates a single environment variable
 */
function validateEnvVar(
  name: keyof EnvironmentVariables,
  value: string | undefined,
  required: boolean = true,
): string | undefined {
  if (!value) {
    if (required) {
      throw new Error(
        `Missing required environment variable: ${name}\n` +
          "Please set this variable in your .env.local file",
      );
    }
    return undefined;
  }

  // Type-specific validation
  if (name === "NODE_ENV") {
    if (!["development", "production", "test"].includes(value)) {
      throw new Error(
        `Invalid NODE_ENV: ${value}. Must be development, production, or test`,
      );
    }
  }

  if (name.includes("URL")) {
    try {
      new URL(value);
    } catch {
      throw new Error(`Invalid URL for ${name}: ${value}`);
    }
  }

  if (name === "STRIPE_SECRET_KEY" && !value.startsWith("sk_")) {
    throw new Error(`Invalid STRIPE_SECRET_KEY: must start with 'sk_'`);
  }

  if (name === "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" && !value.startsWith("pk_")) {
    throw new Error(`Invalid NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: must start with 'pk_'`);
  }

  if (name === "NEXTAUTH_SECRET" && value.length < 32) {
    throw new Error("NEXTAUTH_SECRET must be at least 32 characters long");
  }

  if (name === "PRODUCT_INGEST_API_KEY" && value.length < 16) {
    throw new Error("PRODUCT_INGEST_API_KEY must be at least 16 characters long");
  }

  return value;
}

/**
 * Get validated environment variables
 * Caches validation result for performance
 */
export function getEnv(): Partial<EnvironmentVariables> {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    validatedEnv = {
      // Application
      NODE_ENV:
        (validateEnvVar("NODE_ENV", process.env.NODE_ENV) as
          | "development"
          | "production"
          | "test") || "development",
      NEXTAUTH_URL: validateEnvVar("NEXTAUTH_URL", process.env.NEXTAUTH_URL),
      NEXTAUTH_SECRET: validateEnvVar(
        "NEXTAUTH_SECRET",
        process.env.NEXTAUTH_SECRET,
      ),

      // Database
      DATABASE_URL: validateEnvVar("DATABASE_URL", process.env.DATABASE_URL),
      DIRECT_URL: validateEnvVar("DIRECT_URL", process.env.DIRECT_URL, false),

      // ImageKit
      NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: validateEnvVar(
        "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      ),
      NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: validateEnvVar(
        "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
        process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      ),
      IMAGEKIT_PRIVATE_KEY: validateEnvVar(
        "IMAGEKIT_PRIVATE_KEY",
        process.env.IMAGEKIT_PRIVATE_KEY,
      ),

      // Stripe
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: validateEnvVar(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      ),
      STRIPE_SECRET_KEY: validateEnvVar(
        "STRIPE_SECRET_KEY",
        process.env.STRIPE_SECRET_KEY,
      ),
      STRIPE_WEBHOOK_SECRET: validateEnvVar(
        "STRIPE_WEBHOOK_SECRET",
        process.env.STRIPE_WEBHOOK_SECRET,
      ),

      // Google OAuth
      GOOGLE_CLIENT_ID: validateEnvVar(
        "GOOGLE_CLIENT_ID",
        process.env.GOOGLE_CLIENT_ID,
      ),
      GOOGLE_CLIENT_SECRET: validateEnvVar(
        "GOOGLE_CLIENT_SECRET",
        process.env.GOOGLE_CLIENT_SECRET,
      ),

      // Email
      NEXT_PUBLIC_APP_EMAIL: validateEnvVar(
        "NEXT_PUBLIC_APP_EMAIL",
        process.env.NEXT_PUBLIC_APP_EMAIL,
      ),

      // Product ingest API (server-only)
      PRODUCT_INGEST_API_KEY: validateEnvVar(
        "PRODUCT_INGEST_API_KEY",
        process.env.PRODUCT_INGEST_API_KEY,
      ),
    };

    return validatedEnv;
  } catch (error) {
    console.error("❌ Environment validation failed:");
    if (error instanceof Error) {
      console.error(error.message);
    }
    
    // In production, fail fast
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        "Invalid environment configuration. Please check your .env.local file.",
      );
    }
    
    // In development/preview, allow partial env with warnings
    console.warn("⚠️ Continuing in development mode with partial environment variables");
    validatedEnv = process.env as unknown as Partial<EnvironmentVariables>;
    return validatedEnv;
  }
}

/**
 * Type-safe environment accessor
 * Usage: const { STRIPE_SECRET_KEY } = getEnv();
 */
export function requireEnv<K extends keyof EnvironmentVariables>(
  key: K,
): EnvironmentVariables[K] {
  const env = getEnv();
  const value = env[key];

  if (!value) {
    throw new Error(`Environment variable ${String(key)} is not set or empty`);
  }

  return value as EnvironmentVariables[K];
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return getEnv().NODE_ENV === "development";
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return getEnv().NODE_ENV === "production";
}
