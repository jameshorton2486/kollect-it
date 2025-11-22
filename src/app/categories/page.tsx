import { Metadata } from "next";
import Link from "next/link";
import {
  Hourglass,
  Palette,
  Watch,
  Home,
  Gem,
  ShoppingBag,
  BookOpen,
  Gamepad2,
  Trophy
} from "lucide-react";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "Categories | Kollect-It",
  description: "Browse our curated collection of antiques, fine art, jewelry, and more.",
};

const categories = [
  { name: "Antiques", slug: "antiques", icon: Hourglass },
  { name: "Fine Art", slug: "fine-art", icon: Palette },
  { name: "Jewelry & Timepieces", slug: "jewelry-timepieces", icon: Watch },
  { name: "Home Décor", slug: "home-decor", icon: Home },
  { name: "Collectibles", slug: "collectibles", icon: Gem },
  { name: "Clothing & Accessories", slug: "clothing-accessories", icon: ShoppingBag },
  { name: "Books & Media", slug: "books-media", icon: BookOpen },
  { name: "Toys & Games", slug: "toys-games", icon: Gamepad2 },
  { name: "Sports Memorabilia", slug: "sports-memorabilia", icon: Trophy },
];

export default function CategoriesPage() {
  return (
    <main>
      <AesopSection
        variant="sand"
        layout="full"
        title="Browse Categories"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group block"
            >
              <div className="bg-surface-0 border border-border-300 rounded-lg p-8 text-center transition-all duration-300 hover:shadow-lg hover:border-gold-500 h-full flex flex-col items-center justify-center gap-6">
                <category.icon size={48} color="#C9A66B" strokeWidth={1.5} />
                <h2 className="font-serif text-xl text-ink m-0">
                  {category.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </AesopSection>
    </main>
  );
}
