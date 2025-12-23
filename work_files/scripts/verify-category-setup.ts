import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🔍 Verifying Category System Setup...\n");

  try {
    // Check categories
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: "asc" }
    });

    console.log(`📊 Found ${categories.length} categories:\n`);

    if (categories.length === 0) {
      console.log("❌ No categories found!");
      console.log("   Run: npx tsx scripts/seed-categories.ts");
      process.exit(1);
    }

    let totalSubcategories = 0;
    for (const cat of categories) {
      console.log(`✅ ${cat.name}`);
      console.log(`   Subcategories: ${cat.subcategories.length}`);
      console.log(`   Products: ${cat._count.products}`);
      
      if (cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          console.log(`      └─ ${sub.name}`);
        });
      }
      totalSubcategories += cat.subcategories.length;
      console.log();
    }

    console.log(`📈 Summary:`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Subcategories: ${totalSubcategories}`);
    console.log(`   Total Products: ${categories.reduce((sum, c) => sum + c._count.products, 0)}`);

    // Check if Subcategory table exists and has correct structure
    const subcategoryCount = await prisma.subcategory.count();
    console.log(`\n✅ Subcategory table exists with ${subcategoryCount} records`);

    // Check if Product has subcategoryId column
    const sampleProduct = await prisma.product.findFirst({
      select: {
        id: true,
        title: true,
        categoryId: true,
        subcategoryId: true
      }
    });

    if (sampleProduct) {
      console.log(`\n✅ Product table has subcategoryId column`);
      console.log(`   Sample product: "${sampleProduct.title}"`);
      console.log(`   Category ID: ${sampleProduct.categoryId ? "✅" : "❌"}`);
      console.log(`   Subcategory ID: ${sampleProduct.subcategoryId ? "✅" : "⚠️  (optional)"}`);
    }

    console.log("\n✨ Category system is fully set up and ready!");
    
  } catch (error) {
    console.error("❌ Error verifying setup:", error);
    if (error instanceof Error) {
      if (error.message.includes("does not exist")) {
        console.log("\n💡 The Subcategory table might not exist yet.");
        console.log("   Run: npx prisma db push");
      }
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

