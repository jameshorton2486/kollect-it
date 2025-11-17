import Stripe from "stripe";
import { loadStripe, Stripe as StripeClient } from "@stripe/stripe-js";

/**
 * Stripe Configuration
 * 
 * In production, both STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY are required.
 * In development, Stripe features are gracefully disabled if keys are missing.
 * 
 * Required in production:
 * - STRIPE_SECRET_KEY: Secret key for server-side operations
 * - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Publishable key for client-side
 */

// Allow development without Stripe in non-production environments
let stripeInstance: Stripe | null = null;

if (!process.env.STRIPE_SECRET_KEY) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable in production");
  } else {
    console.warn("[Stripe] STRIPE_SECRET_KEY not set - Stripe features disabled in development");
  }
} else {
  // Server-side Stripe instance
  // Using account default API version (omit apiVersion to use latest stable)
  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
  });
}

export const stripe = stripeInstance;

// Export a safe getter that throws in production but allows dev without Stripe
export function getStripeInstance() {
  if (!stripe) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Stripe not configured - check STRIPE_SECRET_KEY environment variable");
    }
    console.warn("[Stripe] Stripe not available - payment features disabled");
    return null;
  }
  return stripe;
}

// Client-side Stripe promise
let stripePromise: Promise<StripeClient | null>;

export const getStripe = () => {
  if (!stripePromise) {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable in production",
        );
      } else {
        console.warn("[Stripe] Publishable key not set - payment features disabled in development");
        stripePromise = Promise.resolve(null);
      }
    } else {
      stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }
  }
  return stripePromise;
};

// Format amount for Stripe (convert dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Format amount for display (convert cents to dollars)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};

