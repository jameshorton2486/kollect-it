/**
 * Environment Variable Validation
 * 
 * Validates environment variables at runtime and caches results.
 */

import { 
  serverEnvSchema, 
  clientEnvSchema, 
  type ServerEnv, 
  type ClientEnv 
} from './schema';

// Caches
let serverEnvCache: ServerEnv | null = null;
let clientEnvCache: ClientEnv | null = null;

/**
 * Validate and return server environment variables
 * Throws on invalid configuration in production
 */
export function getServerEnv(): ServerEnv {
  if (serverEnvCache) return serverEnvCache;

  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.format();
    console.error('❌ Invalid server environment variables:');
    console.error(JSON.stringify(errors, null, 2));

    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Server environment validation failed. Check logs for details.'
      );
    } else {
      console.warn('⚠️ Continuing in development mode with invalid env vars');
      // Return partial env in development
      return process.env as unknown as ServerEnv;
    }
  }

  serverEnvCache = result.data;
  return result.data;
}

/**
 * Validate and return client environment variables
 */
export function getClientEnv(): ClientEnv {
  if (clientEnvCache) return clientEnvCache;

  const clientEnv = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  };

  const result = clientEnvSchema.safeParse(clientEnv);

  if (!result.success) {
    const errors = result.error.format();
    console.error('❌ Invalid client environment variables:');
    console.error(JSON.stringify(errors, null, 2));

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Client environment validation failed.');
    }
  }

  clientEnvCache = result.data!;
  return clientEnvCache;
}

/**
 * Validate all environment variables
 * Call at app startup
 */
export function validateAllEnv(): { server: ServerEnv; client: ClientEnv } {
  console.log('🔍 Validating environment variables...');

  const server = getServerEnv();
  const client = getClientEnv();

  console.log('✅ Environment variables validated successfully');

  return { server, client };
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
