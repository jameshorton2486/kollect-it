import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      imageUrl,
      category,
      title,
      description,
      // Note: These fields will be fully utilized after database migration
      // shortDescription,
      // estimatedEra,
      // rarity,
      // authenticity,
      // investmentPotential,
      // priceReasoning,
      // seoTitle,
      // seoDescription,
      // keywords,
      // aiAnalysis,
      // isDraft = true,
      suggestedPrice,
    } = body;

    console.log(`\n📦 [API] Create product request`);
    console.log(`   Admin: ${session.user?.email}`);
    console.log(`   Title: "${title}"`);

    // Validate required fields
    const required = [
      'imageUrl',
      'category',
      'title',
      'description',
      'suggestedPrice',
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Find category by name
    const categoryRecord = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!categoryRecord) {
      return NextResponse.json(
        { error: `Category not found: ${category}` },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Product with similar title already exists' },
        { status: 400 }
      );
    }

    // Create product with image
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: suggestedPrice,
        categoryId: categoryRecord.id,
        images: {
          create: {
            url: imageUrl,
            alt: `${title} - High quality photo`,
          },
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    console.log(`✅ [API] Product created: ${product.id}`);
    return NextResponse.json({
      ...product,
      message: 'Product created successfully as draft',
    });
  } catch (error) {
    console.error('❌ [API] Create product error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create product',
      },
      { status: 500 }
    );
  }
}
