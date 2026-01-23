import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/products/[id] - Get single product
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        Category: true,
        Image: { orderBy: { order: "asc" } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[Admin Products] Get error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const body = await request.json();
    const {
      title,
      description,
      price,
      categoryId,
      condition,
      status,
      featured,
      isDraft,
      year,
      artist,
      medium,
      period,
    } = body;

    // Generate new slug if title changed
    let updateData: any = {
      title,
      description,
      price: parseFloat(price) || 0,
      categoryId,
      condition,
      status,
      featured: featured || false,
      isDraft: isDraft || false,
      year,
      artist,
      medium,
      period,
    };

    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Check if slug exists for different product
      const existing = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      });

      updateData.slug = existing
        ? `${slug}-${Date.now().toString().slice(-6)}`
        : slug;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        Category: true,
        Image: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("[Admin Products] Update error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("[Admin Products] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
