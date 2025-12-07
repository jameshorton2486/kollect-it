import { prisma } from "../src/lib/prisma";

// Category and subcategory mapping rules
const categoryRules: Array<{
  categoryName: string;
  subcategoryName?: string;
  keywords: string[];
  regex?: RegExp;
}> = [
  // Fine Art - Paintings
  {
    categoryName: "Fine Art",
    subcategoryName: "Paintings",
    keywords: ["painting", "oil on canvas", "watercolor", "acrylic", "canvas", "portrait", "landscape", "still life"],
  },
  // Fine Art - Prints & Works on Paper
  {
    categoryName: "Fine Art",
    subcategoryName: "Prints & Works on Paper",
    keywords: ["print", "lithograph", "etching", "engraving", "woodcut", "serigraph", "works on paper"],
  },
  // Fine Art - Photography
  {
    categoryName: "Fine Art",
    subcategoryName: "Photography",
    keywords: ["photograph", "photo", "vintage photo", "daguerreotype", "tintype", "albumen print"],
  },
  // Fine Art - Sculpture
  {
    categoryName: "Fine Art",
    subcategoryName: "Sculpture",
    keywords: ["sculpture", "bronze", "marble", "statue", "figurine", "carving"],
  },
  // Fine Art - Posters & Ephemera
  {
    categoryName: "Fine Art",
    subcategoryName: "Posters & Ephemera",
    keywords: ["poster", "ephemera", "advertisement", "advertising", "trade card", "label"],
  },
  // Fine Art - Asian Art
  {
    categoryName: "Fine Art",
    subcategoryName: "Asian Art",
    keywords: ["asian", "japanese", "chinese", "korean", "imari", "satsuma", "porcelain", "ceramic", "jade"],
  },
  // Fine Art - Indigenous / Ethnographic Art
  {
    categoryName: "Fine Art",
    subcategoryName: "Indigenous / Ethnographic Art",
    keywords: ["indigenous", "native american", "ethnographic", "tribal", "african art", "oceanic"],
  },
  // Collectibles - Coins & Currency
  {
    categoryName: "Collectibles",
    subcategoryName: "Coins & Currency",
    keywords: ["coin", "currency", "bill", "banknote", "note", "dollar", "cent", "penny", "dime", "quarter"],
  },
  // Collectibles - Sports Memorabilia
  {
    categoryName: "Collectibles",
    subcategoryName: "Sports Memorabilia",
    keywords: ["sports", "baseball", "basketball", "football", "hockey", "autograph", "signed", "jersey", "card"],
  },
  // Collectibles - Toys & Model Trains
  {
    categoryName: "Collectibles",
    subcategoryName: "Toys & Model Trains",
    keywords: ["toy", "model train", "train", "doll", "action figure", "die cast", "tin toy"],
  },
  // Collectibles - Pop Culture & Music
  {
    categoryName: "Collectibles",
    subcategoryName: "Pop Culture & Music",
    keywords: ["pop culture", "music", "record", "vinyl", "album", "poster", "movie", "film", "star wars", "comic"],
  },
  // Collectibles - Silver
  {
    categoryName: "Collectibles",
    subcategoryName: "Silver",
    keywords: ["silver", "sterling", "silverplate", "silver plate", "silverware", "flatware"],
  },
  // Collectibles - Folk Art & Pottery
  {
    categoryName: "Collectibles",
    subcategoryName: "Folk Art & Pottery",
    keywords: ["folk art", "pottery", "ceramic", "earthenware", "stoneware", "handmade"],
  },
  // Collectibles - Designer / Premium Housewares
  {
    categoryName: "Collectibles",
    subcategoryName: "Designer & Premium Housewares",
    keywords: ["designer", "houseware", "housewares", "premium", "vintage", "mid century", "art deco"],
  },
  // Militaria - Uniforms
  {
    categoryName: "Militaria",
    subcategoryName: "Uniforms",
    keywords: ["uniform", "military uniform", "army", "navy", "air force", "wwii", "ww2", "wwi", "ww1", "usaf", "us army"],
    regex: /uniform|military.*uniform|army.*uniform|navy.*uniform/i,
  },
  // Militaria - Medals, Pins & Insignia
  {
    categoryName: "Militaria",
    subcategoryName: "Medals, Pins & Insignia",
    keywords: ["medal", "pin", "insignia", "badge", "ribbon", "award", "decoration"],
  },
  // Militaria - Maps & Documents
  {
    categoryName: "Militaria",
    subcategoryName: "Maps & Documents",
    keywords: ["map", "document", "military document", "letter", "diary", "journal", "military map"],
  },
  // Militaria - Gear & Equipment
  {
    categoryName: "Militaria",
    subcategoryName: "Gear & Equipment",
    keywords: ["gear", "equipment", "helmet", "canteen", "knife", "bayonet", "weapon", "rifle", "pistol"],
  },
  // Militaria - Historical Artifacts
  {
    categoryName: "Militaria",
    subcategoryName: "Historical Artifacts",
    keywords: ["artifact", "military artifact", "historical", "war", "battle"],
  },
  // Rare Books - Antiquarian (Pre-1800)
  {
    categoryName: "Rare Books",
    subcategoryName: "Antiquarian (Pre-1800)",
    keywords: ["antiquarian", "pre-1800", "17", "16", "15", "14", "13", "12", "11", "10"],
    regex: /\b(1[0-7]\d{2}|[0-9]\d{2})\b/,
  },
  // Rare Books - Literature & Classics
  {
    categoryName: "Rare Books",
    subcategoryName: "Literature & Classics",
    keywords: ["literature", "classic", "novel", "poetry", "poem", "fiction", "first edition"],
  },
  // Rare Books - Exploration & Travel
  {
    categoryName: "Rare Books",
    subcategoryName: "Exploration & Travel",
    keywords: ["exploration", "travel", "voyage", "expedition", "atlas", "map", "geography"],
  },
  // Rare Books - Signed First Editions
  {
    categoryName: "Rare Books",
    subcategoryName: "Signed First Editions",
    keywords: ["signed", "first edition", "autographed", "inscribed", "signed copy"],
  },
  // Rare Books - Art, Culture & History
  {
    categoryName: "Rare Books",
    subcategoryName: "Art, Culture & History",
    keywords: ["art book", "culture", "history", "historical", "biography", "autobiography"],
  },
  // Rare Books - Illustrated Books
  {
    categoryName: "Rare Books",
    subcategoryName: "Illustrated Books",
    keywords: ["illustrated", "illustration", "art book", "picture book", "engraving", "woodcut"],
  },
];

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function findCategoryMatch(
  title: string,
  description: string,
  productNotes?: string | null
): { categoryName: string; subcategoryName?: string } | null {
  const searchText = normalizeText(
    `${title} ${description} ${productNotes || ""}`
  );

  // Try exact matches first (more specific)
  for (const rule of categoryRules) {
    // Check regex if provided
    if (rule.regex && rule.regex.test(searchText)) {
      return {
        categoryName: rule.categoryName,
        subcategoryName: rule.subcategoryName,
      };
    }

    // Check keywords
    for (const keyword of rule.keywords) {
      if (searchText.includes(normalizeText(keyword))) {
        return {
          categoryName: rule.categoryName,
          subcategoryName: rule.subcategoryName,
        };
      }
    }
  }

  // Fallback: try category-only matches
  const categoryOnlyMatches: Record<string, string[]> = {
    "Fine Art": ["art", "painting", "sculpture", "print", "photo"],
    "Collectibles": ["collectible", "vintage", "antique"],
    "Militaria": ["military", "war", "wwii", "ww2", "wwi", "ww1"],
    "Rare Books": ["book", "volume", "edition", "manuscript"],
  };

  for (const [category, keywords] of Object.entries(categoryOnlyMatches)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return { categoryName: category };
      }
    }
  }

  return null;
}

async function main() {
  console.log("🔍 Starting auto-assignment of categories and subcategories...\n");

  // Fetch all categories and subcategories
  const categories = await prisma.category.findMany({
    include: { subcategories: true },
  });

  const categoryMap = new Map(
    categories.map((c) => [c.name, c])
  );

  const subcategoryMap = new Map<string, { id: string; categoryId: string }>();
  categories.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      subcategoryMap.set(`${cat.name}|${sub.name}`, {
        id: sub.id,
        categoryId: cat.id,
      });
    });
  });

  // Fetch all products without categories or with categories but no subcategories
  const products = await prisma.product.findMany({
    include: {
      category: true,
      subcategory: true,
    },
  });

  console.log(`📦 Found ${products.length} products to process\n`);

  let assigned = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of products) {
    try {
      const match = findCategoryMatch(
        product.title,
        product.description,
        product.productNotes
      );

      if (!match) {
        console.log(`⏭️  Skipped: "${product.title}" (no match found)`);
        skipped++;
        continue;
      }

      const category = categoryMap.get(match.categoryName);
      if (!category) {
        console.log(`❌ Category not found: ${match.categoryName}`);
        errors++;
        continue;
      }

      let subcategoryId: string | null = null;
      if (match.subcategoryName) {
        const subKey = `${match.categoryName}|${match.subcategoryName}`;
        const sub = subcategoryMap.get(subKey);
        if (sub) {
          subcategoryId = sub.id;
        }
      }

      // Check if update is needed
      const needsUpdate =
        product.categoryId !== category.id ||
        (subcategoryId && product.subcategoryId !== subcategoryId) ||
        (!subcategoryId && product.subcategoryId !== null);

      if (!needsUpdate) {
        console.log(`✓ Already correct: "${product.title}"`);
        skipped++;
        continue;
      }

      // Update product
      await prisma.product.update({
        where: { id: product.id },
        data: {
          categoryId: category.id,
          subcategoryId: subcategoryId,
        },
      });

      const subcatText = match.subcategoryName
        ? ` → ${match.subcategoryName}`
        : "";
      console.log(
        `✅ Updated: "${product.title}" → ${match.categoryName}${subcatText}`
      );

      if (product.categoryId !== category.id) {
        assigned++;
      } else {
        updated++;
      }
    } catch (error) {
      console.error(`❌ Error processing "${product.title}":`, error);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 Summary:");
  console.log(`   ✅ Newly assigned: ${assigned}`);
  console.log(`   🔄 Updated subcategory: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log("=".repeat(50));
  console.log("\n✨ Auto-assignment complete!");
}

main()
  .catch((e) => {
    console.error("❌ Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
