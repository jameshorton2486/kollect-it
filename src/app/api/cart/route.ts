import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            Image: {
              take: 1,
              select: { url: true },
            },
          },
        },
      },
    });

    const total = cartItems.reduce(
      (sum: number, item: { product: { price: number }; quantity: number }) =>
        sum + item.product.price * item.quantity,
      0,
    );

    return NextResponse.json({ items: cartItems, total });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    // Check if item already in cart
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existing) {
      // Update quantity
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return NextResponse.json(updated);
    }

    // Add new item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, quantity } = await request.json();

    const updated = await prisma.cartItem.update({
      where: { id: itemId, userId: session.user.id },
      data: { quantity },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (itemId) {
      await prisma.cartItem.delete({
        where: { id: itemId, userId: session.user.id },
      });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 },
    );
  }
}

