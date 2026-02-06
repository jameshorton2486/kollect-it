import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe, isStripeEnabled } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { getRequestId } from "@/lib/request-context";
import { respondError } from "@/lib/api-error";

/**
 * Stripe Webhook Handler (Hardened Production Version)
 * 
 * Required Events:
 * - checkout.session.completed
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 * 
 * Recommended Events:
 * - charge.refunded
 * - charge.dispute.created
 * 
 * Security Features:
 * - Signature verification (mandatory in production)
 * - Idempotency protection (prevents duplicate processing)
 * - Event logging and audit trail
 * - Graceful error handling
 */

export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Check if event has already been processed (idempotency)
 */
async function isEventProcessed(stripeEventId: string): Promise<boolean> {
  const existing = await prisma.stripeWebhookEvent.findUnique({
    where: { stripeEventId },
    select: { processed: true },
  });
  return existing?.processed ?? false;
}

/**
 * Mark event as processed
 */
async function markEventProcessed(
  stripeEventId: string,
  eventType: string,
  payload: unknown,
  error?: string,
): Promise<void> {
  await prisma.stripeWebhookEvent.upsert({
    where: { stripeEventId },
    create: {
      stripeEventId,
      eventType,
      processed: !error,
      processedAt: !error ? new Date() : null,
      payload: payload as object,
      error: error || null,
    },
    update: {
      processed: !error,
      processedAt: !error ? new Date() : null,
      error: error || null,
    },
  });
}

/**
 * Handle checkout.session.completed event
 * Creates order when checkout session is completed
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  requestId: string,
): Promise<void> {
  logger.info("Processing checkout.session.completed", {
    requestId,
    sessionId: session.id,
    customerEmail: session.customer_email,
  });

  // Extract order metadata from session
  const orderId = session.metadata?.orderId;
  const paymentIntentId = session.payment_intent as string | null;

  if (!orderId) {
    logger.warn("Checkout session missing orderId in metadata", {
      requestId,
      sessionId: session.id,
    });
    return;
  }

  // Update order with checkout session information
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "paid",
      status: "processing",
      customerEmail: session.customer_email || undefined,
      paymentMethod: paymentIntentId || undefined,
    },
  });

  logger.info("Order updated from checkout session", {
    requestId,
    orderId,
    sessionId: session.id,
  });
}

/**
 * Handle payment_intent.succeeded event
 */
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  requestId: string,
): Promise<void> {
  logger.info("Processing payment_intent.succeeded", {
    requestId,
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
  });

  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) {
    logger.warn("PaymentIntent missing orderId in metadata", {
      requestId,
      paymentIntentId: paymentIntent.id,
    });
    return;
  }

  // Find order by paymentIntentId if orderId not in metadata
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id: orderId },
        { paymentMethod: paymentIntent.id },
      ],
    },
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "paid",
        status: "processing",
      },
    });

    logger.info("Order updated to paid", {
      requestId,
      orderId: order.id,
      paymentIntentId: paymentIntent.id,
    });
  } else {
    logger.warn("Order not found for payment intent", {
      requestId,
      orderId,
      paymentIntentId: paymentIntent.id,
    });
  }
}

/**
 * Handle payment_intent.payment_failed event
 */
async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent,
  requestId: string,
): Promise<void> {
  logger.warn("Processing payment_intent.payment_failed", {
    requestId,
    paymentIntentId: paymentIntent.id,
    failureCode: paymentIntent.last_payment_error?.code,
  });

  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) {
    // Try to find by paymentIntentId
    const order = await prisma.order.findFirst({
      where: { paymentMethod: paymentIntent.id },
    });

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "failed" },
      });
      logger.info("Order marked as failed", {
        requestId,
        orderId: order.id,
      });
    }
    return;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "failed" },
  });

  logger.info("Order marked as failed", {
    requestId,
    orderId,
  });
}

/**
 * Handle charge.refunded event
 */
async function handleChargeRefunded(
  charge: Stripe.Charge,
  requestId: string,
): Promise<void> {
  logger.info("Processing charge.refunded", {
    requestId,
    chargeId: charge.id,
    amount: charge.amount_refunded,
  });

  // Find order by payment intent
  const paymentIntentId = charge.payment_intent as string;
  if (!paymentIntentId) {
    logger.warn("Charge missing payment_intent", {
      requestId,
      chargeId: charge.id,
    });
    return;
  }

  const order = await prisma.order.findFirst({
    where: { paymentMethod: paymentIntentId },
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "refunded",
        status: "refunded",
        notes: `Refunded: ${charge.amount_refunded / 100} ${charge.currency.toUpperCase()}. ${order.notes || ""}`.trim(),
      },
    });

    logger.info("Order marked as refunded", {
      requestId,
      orderId: order.id,
      chargeId: charge.id,
    });
  }
}

/**
 * Handle charge.dispute.created event
 */
async function handleChargeDisputeCreated(
  dispute: Stripe.Dispute,
  requestId: string,
): Promise<void> {
  logger.warn("Processing charge.dispute.created", {
    requestId,
    disputeId: dispute.id,
    chargeId: dispute.charge,
    reason: dispute.reason,
  });

  // Find order by charge/payment intent
  const chargeId = dispute.charge as string;
  // Note: We'd need to query Stripe to get payment_intent from charge
  // For now, log the dispute for manual review
  logger.warn("Charge dispute requires manual review", {
    requestId,
    disputeId: dispute.id,
    chargeId,
    reason: dispute.reason,
    amount: dispute.amount,
  });
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  // Check if Stripe is configured
  if (!isStripeEnabled || !stripe) {
    logger.error("Stripe not configured", { requestId });
    return NextResponse.json(
      { error: "Payment processing is not configured", requestId },
      { status: 503 },
    );
  }

  if (!webhookSecret) {
    logger.error("Stripe webhook secret missing", { requestId });
    return respondError(
      request,
      new Error("STRIPE_WEBHOOK_SECRET is required for Stripe webhooks"),
      { status: 503, code: "webhook_secret_missing" },
    );
  }

  // Get raw body (must be string for signature verification)
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    logger.warn("Stripe webhook missing signature", { requestId });
    return NextResponse.json(
      { error: "Missing signature", requestId },
      { status: 400, headers: { "X-Request-ID": requestId } },
    );
  }

  // Verify webhook signature (MANDATORY in production)
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    logger.error(
      "Stripe webhook signature verification failed",
      { requestId },
      err,
    );
    return NextResponse.json(
      { error: "Invalid signature", requestId },
      { status: 400, headers: { "X-Request-ID": requestId } },
    );
  }

  logger.info("Stripe webhook received", {
    requestId,
    type: event.type,
    eventId: event.id,
  });

  // Check idempotency - has this event been processed already?
  const alreadyProcessed = await isEventProcessed(event.id);
  if (alreadyProcessed) {
    logger.info("Stripe webhook event already processed (idempotency)", {
      requestId,
      eventId: event.id,
      eventType: event.type,
    });
    return NextResponse.json(
      { received: true, duplicate: true, requestId },
      { headers: { "X-Request-ID": requestId } },
    );
  }

  // Process the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
          requestId,
        );
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent,
          requestId,
        );
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent,
          requestId,
        );
        break;

      case "charge.refunded":
        await handleChargeRefunded(
          event.data.object as Stripe.Charge,
          requestId,
        );
        break;

      case "charge.dispute.created":
        await handleChargeDisputeCreated(
          event.data.object as Stripe.Dispute,
          requestId,
        );
        break;

      default:
        logger.info("Unhandled Stripe event type (logged but not processed)", {
          requestId,
          type: event.type,
          eventId: event.id,
        });
    }

    // Mark event as successfully processed
    await markEventProcessed(event.id, event.type, event.data.object);

    return NextResponse.json(
      { received: true, requestId },
      { headers: { "X-Request-ID": requestId } },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Error processing Stripe webhook", { requestId, eventId: event.id }, error);

    // Mark event as failed (will be logged for manual review)
    await markEventProcessed(event.id, event.type, event.data.object, errorMessage);

    return respondError(request, error, {
      status: 500,
      code: "webhook_processing_failed",
    });
  }
}
