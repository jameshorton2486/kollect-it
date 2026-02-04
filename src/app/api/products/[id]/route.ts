import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/auth-helpers";

interface ImageInput {
  url: string;
  alt?: string;
}

// GET /api/products/[id] - Get single product
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const isAdmin = !!session?.user && session.user.role === "admin";

    const product = isAdmin
      ? await prisma.product.findUnique({
          where: { id },
          include: {
            Image: {
              orderBy: { order: "asc" },
            },
            Category: true,
          },
        })
      : await prisma.product.findFirst({
          where: {
            id,
            status: "active",
            isDraft: false,
          },
          include: {
            Image: {
              orderBy: { order: "asc" },
            },
            Category: true,
          },
        });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      price,
      categoryId,
      condition,
      year,
      artist,
      medium,
      period,
      featured,
      status,
      images,
    } = body;

    // Delete existing images if new ones are provided
    if (images) {
      await prisma.image.deleteMany({
        where: { productId: id },
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        categoryId,
        condition,
        year,
        artist,
        medium,
        period,
        featured,
        status,
        Image: images
          ? {
              create: (images as ImageInput[]).map((img, index) => ({
                url: img.url,
                alt: img.alt || title,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        Image: true,
        Category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
