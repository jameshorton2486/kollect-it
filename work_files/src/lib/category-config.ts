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

  // Fallback categories (matching your categories page)
  antiques: {
    slug: "antiques",
    name: "Antiques",
    headline: "Timeless Pieces with History",
    description:
      "Carefully selected antiques spanning centuries of craftsmanship. From furniture to decorative objects, each piece tells a story.",
    heroImage: "/images/categories/antiques/antiques-hero.webp",
    overlayGradient: "from-lux-espresso/85 via-lux-espresso/65 to-transparent",
    seoTitle: "Antiques | Kollect-It",
    seoDescription:
      "Shop authenticated antiques with provenance. Furniture, decorative arts, and historic objects from trusted sources.",
    features: ["Age verification", "Condition reports", "Provenance research"],
  },

  "jewelry-timepieces": {
    slug: "jewelry-timepieces",
    name: "Jewelry & Timepieces",
    headline: "Estate Jewelry & Fine Watches",
    description:
      "Estate jewelry and vintage timepieces selected for quality and character. From Art Deco rings to classic Swiss movements.",
    heroImage: "/images/categories/jewelry/jewelry-hero.webp",
    overlayGradient: "from-lux-carbon/85 via-lux-carbon/65 to-transparent",
    seoTitle: "Jewelry & Timepieces | Kollect-It",
    seoDescription:
      "Discover estate jewelry and vintage watches. Art Deco pieces, Swiss movements, and fine gemstones.",
    features: ["Gemstone certification", "Movement service history", "Appraisal available"],
  },

  "home-decor": {
    slug: "home-decor",
    name: "Home Décor",
    headline: "Distinctive Pieces for Living Spaces",
    description:
      "Decorative objects and furnishings that add character to any room. Vintage lighting, mirrors, textiles, and accent pieces.",
    heroImage: "/images/categories/home-decor/home-decor-hero.webp",
    overlayGradient: "from-lux-taupe/80 via-lux-taupe/60 to-transparent",
    seoTitle: "Home Décor | Kollect-It",
    seoDescription:
      "Shop vintage home décor, decorative objects, and distinctive accent pieces. Curated for quality and style.",
    features: ["Room-ready condition", "Size specifications", "Style guidance"],
  },

  "clothing-accessories": {
    slug: "clothing-accessories",
    name: "Clothing & Accessories",
    headline: "Vintage Fashion & Designer Pieces",
    description:
      "Curated vintage clothing and accessories from notable designers and eras. Each piece authenticated and described in detail.",
    heroImage: "/images/categories/clothing/clothing-hero.webp",
    overlayGradient: "from-lux-charcoal/80 via-lux-charcoal/60 to-transparent",
    seoTitle: "Vintage Clothing & Accessories | Kollect-It",
    seoDescription:
      "Shop authenticated vintage fashion and designer accessories. From haute couture to everyday elegance.",
    features: ["Designer authentication", "Detailed measurements", "Condition notes"],
  },

  "books-media": {
    slug: "books-media",
    name: "Books & Media",
    headline: "Literary & Media Collections",
    description:
      "Books, records, and media collectibles for the discerning collector. From rare editions to vintage vinyl.",
    heroImage: "/images/categories/books-media/books-media-hero.webp",
    overlayGradient: "from-lux-espresso/80 via-lux-espresso/60 to-transparent",
    seoTitle: "Books & Media | Kollect-It",
    seoDescription:
      "Discover rare books, vintage records, and media collectibles. Carefully curated for collectors.",
    features: ["Grading standards", "Detailed descriptions", "Archival shipping"],
  },

  "toys-games": {
    slug: "toys-games",
    name: "Toys & Games",
    headline: "Vintage Toys & Classic Games",
    description:
      "Nostalgic toys and vintage games from beloved eras. Action figures, board games, and collectible playthings.",
    heroImage: "/images/categories/toys-games/toys-games-hero.webp",
    overlayGradient: "from-lux-sage/80 via-lux-sage/60 to-transparent",
    seoTitle: "Vintage Toys & Games | Kollect-It",
    seoDescription:
      "Shop vintage toys, classic games, and nostalgic collectibles. From action figures to board games.",
    features: ["Completeness noted", "Original packaging when available", "Era verification"],
  },

  "sports-memorabilia": {
    slug: "sports-memorabilia",
    name: "Sports Memorabilia",
    headline: "Athletic History & Collectibles",
    description:
      "Sports cards, signed memorabilia, and athletic collectibles. From baseball to football, authenticated pieces with provenance.",
    heroImage: "/images/categories/sports/sports-hero.webp",
    overlayGradient: "from-lux-carbon/80 via-lux-carbon/60 to-transparent",
    seoTitle: "Sports Memorabilia | Kollect-It",
    seoDescription:
      "Authenticated sports memorabilia, signed collectibles, and vintage cards. Professional athlete items with provenance.",
    features: ["Authentication certificates", "Player provenance", "Graded cards"],
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
