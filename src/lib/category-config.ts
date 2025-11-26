/**
 * Category Configuration
 * Luxury marketplace category definitions with editorial copy and metadata
 */

export interface CategoryConfig {
  slug: string;
  name: string;
  headline: string;
  description: string;
  heroImage: string;
  overlayGradient: string;
  seoTitle: string;
  seoDescription: string;
  features: string[];
  collectingTip?: string;
}

/**
 * Main category configurations with luxury editorial styling
 * These configs define the hero appearance and SEO for each category
 */
export const categoryConfigs: Record<string, CategoryConfig> = {
  "rare-books": {
    slug: "rare-books",
    name: "Rare Books & Manuscripts",
    headline: "First Editions & Literary Treasures",
    description:
      "Discover leather-bound volumes, signed first editions, and historic manuscripts from the 17th century onward. Each piece is authenticated and described with provenance details.",
    heroImage: "/images/categories/rare-books/rare-books-hero.webp",
    overlayGradient: "from-lux-espresso/90 via-lux-espresso/70 to-transparent",
    seoTitle: "Rare Books & First Editions | Kollect-It",
    seoDescription:
      "Shop authenticated rare books, first editions, and historic manuscripts. Leather-bound volumes from the 17th century to modern literary treasures.",
    features: [
      "Authenticated provenance",
      "Condition reports included",
      "Archival packaging",
    ],
    collectingTip:
      "Look for books with original dust jackets—they can significantly increase value.",
  },

  "fine-art": {
    slug: "fine-art",
    name: "Fine Art & Ceramics",
    headline: "Paintings, Sculptures & Decorative Arts",
    description:
      "Curated paintings, sculptures, and decorative ceramics chosen for quality, character, and display appeal. From emerging artists to established masters.",
    heroImage: "/images/categories/fine-art/fine-art-hero.webp",
    overlayGradient: "from-lux-charcoal/90 via-lux-charcoal/70 to-transparent",
    seoTitle: "Fine Art & Ceramics | Kollect-It",
    seoDescription:
      "Explore curated fine art, paintings, sculptures, and decorative ceramics. Each piece selected for quality and character.",
    features: [
      "Certificate of authenticity",
      "Artist provenance",
      "Professional photography",
    ],
    collectingTip:
      "Consider the piece's condition and whether it has been professionally restored.",
  },

  collectibles: {
    slug: "collectibles",
    name: "Collectibles",
    headline: "Vintage Finds & Curious Objects",
    description:
      "Interesting objects, sports items, and unusual finds that make fun additions to a collection. From vintage toys to sports memorabilia and unique curiosities.",
    heroImage: "/images/categories/collectibles/collectibles-hero.webp",
    overlayGradient: "from-lux-sage/80 via-lux-sage/60 to-transparent",
    seoTitle: "Collectibles & Vintage Finds | Kollect-It",
    seoDescription:
      "Browse vintage collectibles, sports memorabilia, and unique curiosities. Hand-selected items with character and story.",
    features: [
      "Detailed descriptions",
      "Condition grading",
      "Secure shipping",
    ],
    collectingTip:
      "Focus on items that bring you joy—the best collections reflect personal passion.",
  },

  militaria: {
    slug: "militaria",
    name: "Historic Militaria",
    headline: "Medals, Uniforms & Military History",
    description:
      "Medals, ribbon bars, uniforms, and service memorabilia with documented history where possible. Each piece connects to the broader story of military service.",
    heroImage: "/images/categories/militaria/militaria-hero.webp",
    overlayGradient: "from-lux-carbon/90 via-lux-carbon/70 to-transparent",
    seoTitle: "Historic Militaria & Medals | Kollect-It",
    seoDescription:
      "Authentic military medals, uniforms, and historic memorabilia. Documented provenance and detailed historical context.",
    features: [
      "Research documentation",
      "Historical context",
      "Authenticity verified",
    ],
    collectingTip:
      "Items with documented provenance and named recipients command premium values.",
  },
};

/**
 * Get category config by slug, with fallback to default values
 */
export function getCategoryConfig(slug: string): CategoryConfig {
  const config = categoryConfigs[slug];

  if (config) {
    return config;
  }

  // Return a default config for unknown categories
  return {
    slug,
    name: formatCategoryName(slug),
    headline: "Curated Collection",
    description: "Hand-selected pieces chosen for quality, character, and story.",
    heroImage: "/images/categories/default/default-hero.webp",
    overlayGradient: "from-lux-charcoal/80 via-lux-charcoal/60 to-transparent",
    seoTitle: `${formatCategoryName(slug)} | Kollect-It`,
    seoDescription: `Shop curated ${formatCategoryName(slug).toLowerCase()} at Kollect-It. Each piece personally selected and described.`,
    features: ["Detailed descriptions", "Quality assured", "Secure shipping"],
  };
}

/**
 * Format a slug into a display name
 */
function formatCategoryName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get all configured category slugs
 */
export function getConfiguredCategorySlugs(): string[] {
  return Object.keys(categoryConfigs);
}
