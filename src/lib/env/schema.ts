/**
 * Environment Variable Schema
 * 
 * Defines and validates all environment variables at startup.
 * Separates server-only from client-safe variables.
 */

import { z } from 'zod';

/**
 * Server-only environment variables
 * These must NEVER be exposed to the client bundle
 */
export const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid PostgreSQL URL'),

  // Authentication
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url().optional(),

  // AI Services
  ANTHROPIC_API_KEY: z
    .string()
    .startsWith('sk-ant-', 'ANTHROPIC_API_KEY must start with sk-ant-')
    .optional(),
  OPENAI_API_KEY: z
    .string()
    .startsWith('sk-', 'OPENAI_API_KEY must start with sk-')
    .optional(),

  // ImageKit
  IMAGEKIT_PRIVATE_KEY: z
    .string()
    .startsWith('private_', 'IMAGEKIT_PRIVATE_KEY must start with private_')
    .optional(),

  // Stripe
  STRIPE_SECRET_KEY: z
    .string()
    .startsWith('sk_', 'STRIPE_SECRET_KEY must start with sk_')
    .optional(),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .startsWith('whsec_', 'STRIPE_WEBHOOK_SECRET must start with whsec_')
    .optional(),

  // Email
  EMAIL_HOST: z.string().optional().default('smtp.zoho.com'),
  EMAIL_PORT: z.string().optional().default('587'),
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASSWORD: z.string().min(1, 'EMAIL_PASSWORD cannot be empty').optional(),
  EMAIL_FROM: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),

  // Internal Services (Desktop App API Auth)
  PRODUCT_INGEST_API_KEY: z
    .string()
    .min(16, 'PRODUCT_INGEST_API_KEY must be at least 16 characters'),

  // Redis (Upstash REST)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Optional
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Security / Internal
  WEBHOOK_SECRET: z.string().min(16, 'WEBHOOK_SECRET must be at least 16 characters'),
  HEALTHCHECK_TOKEN: z.string().min(16, 'HEALTHCHECK_TOKEN must be at least 16 characters').optional(),

  // Vercel
  VERCEL_URL: z.string().optional(),
});

/**
 * Client-safe environment variables
 * Only variables with NEXT_PUBLIC_ prefix
 */
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),
  NEXT_PUBLIC_SITE_URL: z.string().url('NEXT_PUBLIC_SITE_URL must be a valid URL').optional(),
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL').optional(),
  NEXT_PUBLIC_WS_URL: z.string().url('NEXT_PUBLIC_WS_URL must be a valid URL').optional(),
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z
    .string()
    .startsWith('public_', 'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY must start with public_')
    .optional(),
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z
    .string()
    .url('NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT must be a valid URL')
    .optional(),
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
    .optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith('pk_', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_')
    .optional(),
  NEXT_PUBLIC_ENABLE_WEB_VITALS: z.string().optional(),
});

// Type exports
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * List of server-only variable names for security scanning
 */
export const SERVER_ONLY_VAR_NAMES = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXTAUTH_SECRET',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'IMAGEKIT_PRIVATE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_FROM',
  'ADMIN_EMAIL',
  'PRODUCT_INGEST_API_KEY',
  'WEBHOOK_SECRET',
  'HEALTHCHECK_TOKEN',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'VERCEL_URL',
] as const;
