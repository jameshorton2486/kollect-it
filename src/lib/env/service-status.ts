/**
 * Centralized service availability checks
 *
 * Use these to gate features at runtime without crashing.
 * Import and check before calling service-specific code.
 */

export const serviceStatus = {
  stripe: {
    enabled: !!(
      process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ),
    webhooks: !!process.env.STRIPE_WEBHOOK_SECRET,
  },
  imageKit: {
    enabled: !!(
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY &&
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
    ),
  },
  email: {
    enabled: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
    host: process.env.EMAIL_HOST || "not configured",
  },
} as const;

/**
 * Log service status at startup (call from instrumentation or layout)
 */
export function logServiceStatus(): void {
  console.log(
    "[Services] Stripe:",
    serviceStatus.stripe.enabled ? "ENABLED" : "DISABLED",
  );
  console.log(
    "[Services] Stripe Webhooks:",
    serviceStatus.stripe.webhooks ? "ENABLED" : "DISABLED",
  );
  console.log(
    "[Services] ImageKit:",
    serviceStatus.imageKit.enabled ? "ENABLED" : "DISABLED",
  );
  console.log(
    "[Services] Email:",
    serviceStatus.email.enabled ? "ENABLED" : "DISABLED",
  );
}
