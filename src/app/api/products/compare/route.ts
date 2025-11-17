import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids")?.split(",") || [];

    if (ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        status: "active",
      },
      include: {
        images: {
          take: 1,
          select: { url: true },
        },
        category: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Comparison fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

