import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const rating = searchParams.get("rating");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 },
      );
    }

    const where: any = { productId };
    if (rating) {
      where.rating = parseInt(rating);
    }

    const [reviews, stats] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: [{ helpful: "desc" }, { createdAt: "desc" }],
      }),
      prisma.review.groupBy({
        by: ["rating"],
        where: { productId },
        _count: true,
      }),
    ]);

    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce(
        (sum: number, r: { rating: number }) => sum + r.rating,
        0,
      ) / (totalReviews || 1);

    const ratingBreakdown = [1, 2, 3, 4, 5].map((star) => ({
      rating: star,
      count:
        stats.find((s: { rating: number; _count: number }) => s.rating === star)
          ?._count || 0,
    }));

    return NextResponse.json({
      reviews,
      stats: {
        average: averageRating,
        total: totalReviews,
        breakdown: ratingBreakdown,
      },
    });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
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

    const { productId, rating, title, comment, images } = await request.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 400 },
      );
    }

    // Check if user purchased this product (optional - for verified badge)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: "COMPLETED",
        },
      },
    });

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        title,
        comment,
        images: images || [],
        verified: !!hasPurchased,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
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

    const { reviewId, helpful } = await request.json();

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { helpful: { increment: helpful ? 1 : -1 } },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

