import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Search for products matching the query
    const products = await prisma.product.findMany({
      where: {
        status: "active",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: {
        id: true,
        title: true,
        categoryId: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const suggestions = products.map((product: any) => ({
      id: product.id,
      name: product.title,
      category: product.categoryId,
      image: product.images[0] || "/placeholder.svg",
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 },
    );
  }
}

