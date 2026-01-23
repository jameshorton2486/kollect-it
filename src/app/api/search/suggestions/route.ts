import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // FIXED the HTML escape here
    if (query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        categoryId: true,
      },
    });

    // FIXED the HTML escape here
    const suggestions = products.map((product) => ({
      id: product.id,
      name: product.title,
      category: product.CategoryId,
      slug: product.slug,
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Search suggestions API error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
