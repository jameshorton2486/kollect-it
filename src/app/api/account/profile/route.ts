import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email && !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userWhere = session.user.id
      ? { id: session.user.id }
      : { email: session.user.email!.toLowerCase() };

    const user = await prisma.user.findUnique({
      where: userWhere,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[Account] Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address, city, state, zipCode } = await request.json();

    const userWhere = session.user.id
      ? { id: session.user.id }
      : { email: session.user.email!.toLowerCase() };

    const updatedUser = await prisma.user.update({
      where: userWhere,
      data: {
        name: name || undefined,
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zipCode: zipCode || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    console.log(`[Account] Profile updated for ${session.user.email}`);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("[Account] Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
