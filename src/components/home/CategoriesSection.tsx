import { Award, BookOpen, Gem, ShoppingBag, Star, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  imageUrl?: string;
}

function CategoryCard({ icon, title, description, href, imageUrl }: CategoryCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <a href={href} className="block">
        <div className="relative h-48 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-shop-50 flex items-center justify-center">
              <div className="text-shop-accent1">{icon}</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-shop-accent1">{icon}</span>
            <h3 className="text-xl font-semibold text-shop-800">{title}</h3>
          </div>
          <p className="text-shop-600">{description}</p>
        </div>
      </a>
    </Card>
  );
}

export function CategoriesSection() {
  const categories = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Fine Art & Antiques",
      description: "Masterpieces and historical treasures from renowned artists and periods",
      href: "/categories/fine-art",
      imageUrl: "/placeholder.svg"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Rare Books & Literature",
      description: "First editions, signed copies, and vintage publications",
      href: "/categories/books",
      imageUrl: "/placeholder.svg"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Jewelry & Accessories",
      description: "Vintage and antique jewelry pieces with unique character",
      href: "/categories/jewelry",
      imageUrl: "/placeholder.svg"
    },
    {
      icon: <Gem className="w-8 h-8" />,
      title: "Vintage Collectibles",
      description: "Coins, stamps, toys, and memorabilia from past eras",
      href: "/categories/vintage",
      imageUrl: "/placeholder.svg"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Home Decor",
      description: "Unique antique furniture and decorative pieces",
      href: "/categories/home-decor",
      imageUrl: "/placeholder.svg"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Other Treasures",
      description: "Discover more unique and hard-to-find collectibles",
      href: "/categories/other",
      imageUrl: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white" aria-labelledby="categories-heading">
      <div className="max-w-6xl mx-auto">
        <h2 
          id="categories-heading"
          className="text-3xl md:text-4xl font-bold text-center text-shop-900 mb-4"
        >
          Discover Our Diverse Collection
        </h2>
        <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
          Explore a broad array of items, including antiques, vintage treasures, fine art, 
          rare books, jewelry, and more.
        </p>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Collection categories"
        >
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}