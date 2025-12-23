import { prisma } from "../src/lib/prisma";

const categories = [
  {
    name: "Fine Art",
    slug: "fine-art",
    subcategories: [
      "Paintings",
      "Prints & Works on Paper",
      "Photography",
      "Sculpture",
      "Posters & Ephemera",
      "Asian Art",
      "Indigenous / Ethnographic Art",
    ],
  },
  {
    name: "Collectibles",
    slug: "collectibles",
    subcategories: [
      "Coins & Currency",
      "Sports Memorabilia",
      "Toys & Model Trains",
      "Pop Culture & Music",
      "Silver",
      "Folk Art & Pottery",
      "Designer & Premium Housewares",
    ],
  },
  {
    name: "Militaria",
    slug: "militaria",
    subcategories: [
      "Uniforms",
      "Medals, Pins & Insignia",
      "Maps & Documents",
      "Gear & Equipment",
      "Historical Artifacts",
    ],
  },
  {
    name: "Rare Books",
    slug: "rare-books",
    subcategories: [
      "Antiquarian (Pre-1800)",
      "Literature & Classics",
      "Exploration & Travel",
      "Signed First Editions",
      "Art, Culture & History",
      "Illustrated Books",
    ],
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("🌱 Seeding categories and subcategories...\n");

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        // Update subcategories if they don't exist
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        subcategories: {
          create: cat.subcategories.map((s) => ({
            name: s,
            slug: slugify(s),
          })),
        },
      },
    });

    console.log(`✅ Category: ${created.name}`);

    // Ensure all subcategories exist (in case category already existed)
    for (const subName of cat.subcategories) {
      const subSlug = slugify(subName);
      await prisma.subcategory.upsert({
        where: { slug: subSlug },
        update: {},
        create: {
          name: subName,
          slug: subSlug,
          categoryId: created.id,
        },
      });
      console.log(`   └─ Subcategory: ${subName}`);
    }
  }

  console.log("\n✨ Done! Categories and subcategories seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

