import { NextRequest, NextResponse } from "next/server";
import { stripe, formatAmountForStripe } from "@/lib/stripe";
import { rateLimiters } from "@/lib/rate-limit";
import { securityMiddleware, applySecurityHeaders } from "@/lib/security";

interface ValidatedCartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

/**
 * Create Stripe Payment Intent
 *
 * SECURITY: Validates cart server-side before creating payment
 * Rate limited strictly to prevent abuse (5 requests per 15 minutes)
 */
export async function POST(request: NextRequest) {
  try {
    // Apply enhanced security for payment endpoint
    const securityCheck = await securityMiddleware(request, {
      maxBodySize: 1024 * 1024, // 1MB max
      allowedContentTypes: ["application/json"],
    });
    if (securityCheck) return securityCheck;

    // Apply strict rate limiting for payment operations
    const rateLimitCheck = await rateLimiters.strict(request);
    if (rateLimitCheck) return rateLimitCheck;
    const { items, shippingInfo } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // STEP 1: Validate cart server-side (prevents price tampering)
    const validationResponse = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/checkout/validate-cart`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      },
    );

    if (!validationResponse.ok) {
      const error = await validationResponse.json();
      return NextResponse.json(
        { error: error.error || "Cart validation failed" },
        { status: 400 },
      );
    }

    const validatedCart = await validationResponse.json();

    // STEP 2: Create Payment Intent with validated amounts
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(validatedCart.total),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        subtotal: validatedCart.subtotal.toString(),
        tax: validatedCart.tax.toString(),
        shipping: validatedCart.shipping.toString(),
        total: validatedCart.total.toString(),
        itemCount: validatedCart.items.length.toString(),
        shippingName: shippingInfo.fullName,
        shippingEmail: shippingInfo.email,
        shippingPhone: shippingInfo.phone,
        shippingAddress: JSON.stringify({
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        }),
        items: JSON.stringify(
          validatedCart.items.map((item: ValidatedCartItem) => ({
            id: item.productId,
            title: item.title,
            price: item.price, // Validated database price
            quantity: item.quantity,
          })),
        ),
      },
      description: `Kollect-It Order - ${validatedCart.items.length} item(s)`,
      receipt_email: shippingInfo.email,
      shipping: {
        name: shippingInfo.fullName,
        phone: shippingInfo.phone,
        address: {
          line1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.zipCode,
          country: "US",
        },
      },
    });

    const response = NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      validatedTotal: validatedCart.total, // Return validated total to client
    });
    return applySecurityHeaders(response);
  } catch (error) {
    console.error("Error creating payment intent:", error);
    const errorResponse = NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment intent",
      },
      { status: 500 },
    );
    return applySecurityHeaders(errorResponse);
  }
}

