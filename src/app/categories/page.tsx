import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories | Kollect-It",
  description: "Browse our curated collection of antiques, fine art, jewelry, and more.",
};

const categories = [
  { name: "Antiques", slug: "antiques" },
  { name: "Fine Art", slug: "fine-art" },
  { name: "Jewelry & Timepieces", slug: "jewelry-timepieces" },
  { name: "Home Décor", slug: "home-decor" },
  { name: "Collectibles", slug: "collectibles" },
  { name: "Clothing & Accessories", slug: "clothing-accessories" },
  { name: "Books & Media", slug: "books-media" },
  { name: "Toys & Games", slug: "toys-games" },
  { name: "Sports Memorabilia", slug: "sports-memorabilia" },
];

export default function CategoriesPage() {
  return (
    <div style={{ backgroundColor: "#F7F6F2", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ 
          fontFamily: "serif", 
          fontSize: "3rem", 
          color: "#3A3A3A", 
          marginBottom: "40px", 
          textAlign: "center" 
        }}>
          Browse Categories
        </h1>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "30px" 
        }}>
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/category/${category.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div style={{ 
                backgroundColor: "#FFFFFF", 
                border: "1px solid #EAE6DD", 
                borderRadius: "8px", 
                padding: "40px 20px", 
                textAlign: "center",
                transition: "all 0.3s ease",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <h2 style={{ 
                  fontFamily: "serif", 
                  fontSize: "1.5rem", 
                  color: "#3A3A3A",
                  margin: 0
                }}>
                  {category.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
