import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join, extname, normalize } from "path";
import { existsSync } from "fs";

// Allowed image formats for security
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Sanitize filename to prevent path traversal attacks
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/^\.+/, "") // Remove leading dots
    .substring(0, 100); // Limit length
}

/**
 * Validate file extension matches allowed types
 */
function isValidExtension(filename: string): boolean {
  const ext = extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const categoryId = formData.get("categoryId") as string | null;

    // Validate required fields
    if (!file || !categoryId) {
      return NextResponse.json(
        { error: "Missing file or category ID" },
        { status: 400 },
      );
    }

    // Validate MIME type (browser provided, but can be spoofed)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File must be a valid image (JPEG, PNG, WebP, AVIF)" },
        { status: 400 },
      );
    }

    // Validate file extension
    if (!isValidExtension(file.name)) {
      return NextResponse.json(
        { error: "Invalid file extension" },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Create safe filename
    const ext = extname(file.name).toLowerCase();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const sanitized = sanitizeFilename(file.name.replace(ext, ""));
    const filename = `category-${categoryId}-${timestamp}-${random}-${sanitized}${ext}`;

    // Ensure safe path (prevent directory traversal)
    const uploadDir = join(process.cwd(), "public", "images");
    const filepath = join(uploadDir, filename);

    // Verify the resolved path is within uploadDir
    const normalizedPath = normalize(filepath);
    const normalizedDir = normalize(uploadDir);

    if (!normalizedPath.startsWith(normalizedDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    // Update category with new image path
    const imageUrl = `/images/${filename}`;
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { image: imageUrl },
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      category: updatedCategory,
    });
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV === "development";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("[Upload Error]", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: isDevelopment ? errorMessage : "Failed to upload image",
        code: "UPLOAD_FAILED",
      },
      { status: 500 },
    );
  }
}

