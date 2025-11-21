import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Validation schemas - Using simple validation instead of Zod
interface CartItem {
  productId: string;
  quantity: number;
  price?: number; // Ignored - we use database price
}

interface ValidateCartRequest {
  items: CartItem[];
}

/**
 * Cart Validation Endpoint
 * Validates cart items against database to prevent price tampering and fraud
 *
 * SECURITY FEATURES:
 * - Re-fetches prices from database (ignores client prices)
 * - Validates product availability and status
 * - Input validation with type checks
 * - Detailed error responses for debugging
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input structure
    if (
      !body ||
      typeof body !== "object" ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid request: items must be a non-empty array",
          code: "INVALID_FORMAT",
        },
        { status: 400 },
      );
    }

    const { items } = body as ValidateCartRequest;

    // Validate each item against database
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      // Validate item structure
      if (
        !item.productId ||
        typeof item.productId !== "string" ||
        !item.quantity ||
        typeof item.quantity !== "number" ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid item format: productId must be string, quantity must be 1-99",
            code: "INVALID_ITEM",
          },
          { status: 400 },
        );
      }

      try {
        // Fetch product from database
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            title: true,
            price: true,
            status: true,
          },
        });

        // Validate product exists
        if (!product) {
          return NextResponse.json(
            {
              error: "Product not found",
              code: "PRODUCT_NOT_FOUND",
              productId: item.productId,
            },
            { status: 400 },
          );
        }

        // Validate product is active
        if (product.status !== "active") {
          return NextResponse.json(
            {
              error: `Product "${product.title}" is no longer available`,
              code: "PRODUCT_UNAVAILABLE",
              productId: product.id,
            },
            { status: 400 },
          );
        }

        // CRITICAL: Use database price, ignore client price
        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;

        validatedItems.push({
          productId: product.id,
          title: product.title,
          price: product.price, // Database price (overrides client)
          quantity: item.quantity,
          lineTotal,
        });
      } catch (itemError) {
        if (
          itemError instanceof Error &&
          itemError.message.includes("PRODUCT")
        ) {
          throw itemError; // Re-throw known errors
        }
        throw new Error(`Failed to validate item ${item.productId}`);
      }
    }

    // Calculate tax (8% - adjust based on business rules)
    const tax = Math.round(subtotal * 0.08 * 100) / 100;

    // Calculate shipping (free for now)
    const shipping = 0;

    // Calculate total
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    return NextResponse.json({
      valid: true,
      items: validatedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV === "development";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("[Cart Validation Error]", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: isDevelopment
          ? errorMessage
          : "Failed to validate cart. Please try again.",
        code: "VALIDATION_ERROR",
      },
      { status: 500 },
    );
  }
}

