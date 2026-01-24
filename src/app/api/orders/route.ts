import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        OrderItem: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("[ORDERS] Error details:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack?.split('\n').slice(0, 3),
    });
    
    // More specific error messages
    if (error?.code === 'P1001' || error?.message?.includes('Can\'t reach database')) {
      return NextResponse.json(
        { 
          error: "Database connection failed",
          details: "DATABASE_URL may be incorrect or database is unreachable"
        },
        { status: 503 },
      );
    }
    
    if (error?.code === 'P1000' || error?.message?.includes('authentication')) {
      return NextResponse.json(
        { 
          error: "Database authentication failed",
          details: "Check DATABASE_URL credentials"
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 },
    );
  }
}

