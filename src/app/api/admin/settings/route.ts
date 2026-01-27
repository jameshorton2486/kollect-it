import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

    const defaultSettings = {
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

    const allowedKeys = Object.keys(defaultSettings);

    if (tab) {
      if (!allowedKeys.includes(tab)) {
        return NextResponse.json(
          { error: "Invalid settings tab" },
          { status: 400 },
        );
      }

      const existing = await prisma.adminSetting.findUnique({
        where: { key: tab },
        select: { data: true },
      });

      return NextResponse.json(
        existing?.data ?? defaultSettings[tab as keyof typeof defaultSettings],
      );
    }

    const stored = await prisma.adminSetting.findMany({
      where: { key: { in: allowedKeys } },
      select: { key: true, data: true },
    });

    const storedMap = new Map(stored.map((s) => [s.key, s.data]));
    const merged = Object.fromEntries(
      allowedKeys.map((key) => [
        key,
        storedMap.get(key) ?? defaultSettings[key as keyof typeof defaultSettings],
      ]),
    );

    return NextResponse.json(merged);
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

    const allowedKeys = ["store", "payment", "shipping", "tax", "categories"];
    if (!tab || !allowedKeys.includes(tab)) {
      return NextResponse.json(
        { error: "Invalid settings tab" },
        { status: 400 },
      );
    }

    const storeSchema = z.object({
      storeName: z.string().min(1),
      storeEmail: z.string().email(),
      storePhone: z.string().min(3),
      storeAddress: z.string().min(3),
      currency: z.string().min(1),
      timezone: z.string().min(1),
      language: z.string().min(1),
    });

    const paymentSchema = z.object({
      stripeEnabled: z.boolean(),
      stripePublishableKey: z.string().optional(),
      stripeSecretKey: z.string().optional(),
      paypalEnabled: z.boolean(),
      paypalClientId: z.string().optional(),
      testMode: z.boolean().optional(),
    });

    const shippingSchema = z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        countries: z.array(z.string()).min(1),
        flatRate: z.number().nonnegative(),
        freeShippingThreshold: z.number().nonnegative(),
      }),
    );

    const taxSchema = z.array(
      z.object({
        id: z.string(),
        region: z.string(),
        rate: z.number().nonnegative(),
        applyToShipping: z.boolean(),
      }),
    );

    const categoriesSchema = z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        active: z.boolean(),
      }),
    );

    const tabSchemas: Record<string, z.ZodTypeAny> = {
      store: storeSchema,
      payment: paymentSchema,
      shipping: shippingSchema,
      tax: taxSchema,
      categories: categoriesSchema,
    };

    const schema = tabSchemas[tab];
    if (!schema) {
      return NextResponse.json(
        { error: "Invalid settings tab" },
        { status: 400 },
      );
    }

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid settings data", details: parsed.error.format() },
        { status: 400 },
      );
    }

    await prisma.adminSetting.upsert({
      where: { key: tab },
      update: { data: parsed.data },
      create: { key: tab, data: parsed.data },
    });

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

