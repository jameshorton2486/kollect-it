import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment processing is not configured" },
        { status: 503 },
      );
    }

    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID required" },
        { status: 400 },
      );
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 },
      );
    }

    // Get session (optional - guest checkout allowed)
    const session = await getServerSession(authOptions);
    let userId: string | null = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id || null;
    }

    // Parse metadata
    const metadata = paymentIntent.metadata;
    const items = JSON.parse(metadata.items || "[]") as OrderItem[];
    const shippingAddress = JSON.parse(
      metadata.shippingAddress || "{}",
    ) as ShippingAddress;

    // Validate required metadata fields
    if (!metadata.subtotal || !metadata.tax || !metadata.shipping || !metadata.total) {
      return NextResponse.json(
        { error: "Missing required order metadata" },
        { status: 400 },
      );
    }

    if (!metadata.shippingName || !metadata.shippingEmail) {
      return NextResponse.json(
        { error: "Missing required customer information" },
        { status: 400 },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing order items" },
        { status: 400 },
      );
    }

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode ||
      !shippingAddress.country
    ) {
      return NextResponse.json(
        { error: "Missing required shipping address fields" },
        { status: 400 },
      );
    }

    // Generate order number
    const orderNumber = `KI-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Check if order already exists (prevent duplicate orders)
    const existingOrder = await prisma.order.findFirst({
      where: {
        paymentMethod: paymentIntentId,
      },
    });

    let emailConfigured = false;
    let emailModule: Awaited<typeof import("@/lib/email")> | null = null;

    try {
      emailModule = await import("@/lib/email");
      emailConfigured = emailModule.isEmailConfigured();
    } catch (emailLibError) {
      console.error("Error loading email module:", emailLibError);
    }

    if (existingOrder) {
      // Return existing order
      return NextResponse.json({
        order: {
          orderNumber: existingOrder.orderNumber,
          email: metadata.shippingEmail,
          total: existingOrder.total,
          items: items.map((item) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress,
        },
        emailConfigured,
      });
    }

    // Parse numeric values with validation
    const subtotal = parseFloat(metadata.subtotal);
    const tax = parseFloat(metadata.tax);
    const shipping = parseFloat(metadata.shipping);
    const total = parseFloat(metadata.total);

    if (isNaN(subtotal) || isNaN(tax) || isNaN(shipping) || isNaN(total)) {
      return NextResponse.json(
        { error: "Invalid numeric values in order metadata" },
        { status: 400 },
      );
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || undefined,
        status: "processing",
        subtotal,
        tax,
        shipping,
        total,
        customerName: metadata.shippingName,
        customerEmail: metadata.shippingEmail,
        customerPhone: metadata.shippingPhone || undefined,
        shippingAddress: shippingAddress.address,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingZip: shippingAddress.zipCode,
        shippingCountry: shippingAddress.country,
        paymentMethod: paymentIntentId,
        paymentStatus: "paid",
        OrderItem: {
          create: items.map((item) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        OrderItem: true,
      },
    });

    // Send confirmation emails if configured
    if (emailConfigured && emailModule) {
      try {
        // Ensure all required fields are present for email
        const emailData = {
          orderNumber: order.orderNumber,
          customerName: metadata.shippingName,
          customerEmail: metadata.shippingEmail,
          total: order.total,
          subtotal: order.subtotal,
          tax: order.tax,
          shipping: order.shipping,
          items: order.OrderItem.map((item) => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingAddress,
        };

        emailModule.sendOrderConfirmationEmail(emailData);
        emailModule.sendAdminNewOrderEmail(emailData);
      } catch (emailError) {
        console.error("Error sending order emails:", emailError);
      }
    }

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        email: metadata.shippingEmail,
        total: order.total,
        items: order.OrderItem.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
      },
      emailConfigured,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 },
    );
  }
}
