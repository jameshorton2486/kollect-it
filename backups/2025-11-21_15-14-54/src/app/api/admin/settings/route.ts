import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Admin Settings API
 * Phase 6 Step 8 - Store settings, payment config, shipping, tax rates
 */

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab");

    // In production, fetch from database
    // For now, return mock data
    const settings = {
      store: {
        storeName: "Kollect-It Marketplace",
        storeEmail: "admin@kollect-it.com",
        storePhone: "+1 (555) 123-4567",
        storeAddress: "123 Main St, City, State 12345",
        currency: "USD",
        timezone: "America/New_York",
        language: "en",
      },
      payment: {
        stripeEnabled: true,
        stripePublishableKey:
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_...",
        stripeSecretKey: "••••••••",
        paypalEnabled: false,
        paypalClientId: "",
        testMode: true,
      },
      shipping: [
        {
          id: "1",
          name: "Domestic",
          countries: ["US"],
          flatRate: 9.99,
          freeShippingThreshold: 100,
        },
        {
          id: "2",
          name: "International",
          countries: ["CA", "UK"],
          flatRate: 24.99,
          freeShippingThreshold: 200,
        },
      ],
      tax: [
        { id: "1", region: "California", rate: 7.25, applyToShipping: false },
        { id: "2", region: "New York", rate: 8.875, applyToShipping: true },
      ],
      categories: [
        {
          id: "1",
          name: "Antiques",
          slug: "antiques",
          description: "Vintage and antique items",
          active: true,
        },
        {
          id: "2",
          name: "Collectibles",
          slug: "collectibles",
          description: "Rare collectible items",
          active: true,
        },
        {
          id: "3",
          name: "Art",
          slug: "art",
          description: "Fine art and prints",
          active: true,
        },
      ],
    };

    if (tab && tab in settings) {
      return NextResponse.json(settings[tab as keyof typeof settings]);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { tab, data } = body;

    // In production, save to database
    // For now, just return success
    console.log(`Saving ${tab} settings:`, data);

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 },
    );
  }
}

