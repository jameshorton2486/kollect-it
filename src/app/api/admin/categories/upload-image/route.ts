import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const categoryId = formData.get('categoryId') as string;

    if (!file || !categoryId) {
      return NextResponse.json(
        { error: 'Missing file or category ID' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Create unique filename
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `category-${categoryId}-${timestamp}-${random}.${ext}`;

    // Save to public/images directory
    const uploadDir = join(process.cwd(), 'public', 'images');
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    // Update category with image path
    const imageUrl = `/images/${filename}`;
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { image: imageUrl },
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      category,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
