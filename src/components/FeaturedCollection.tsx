import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function FeaturedCollection() {
  return (
    <section className="py-16 md:py-24 bg-lux-carbon">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen
                className="h-5 w-5 text-lux-gold"
                strokeWidth={1.5}
              />
              <p className="text-sm font-medium text-lux-gold uppercase tracking-widest">
                Featured Collection
              </p>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-lux-white mb-6 leading-tight font-normal">
              Treasures of the Archive: Rare Books & First Editions
            </h2>

            <p className="text-lg text-lux-gray-light leading-relaxed mb-4 font-light">
              From leather-bound volumes dating back to the 17th century to
              first editions and manuscripts, our rare book collection
              represents centuries of literary heritage. Each volume has been
              authenticated and documented with care.
            </p>

            <p className="text-lg text-lux-gray-light leading-relaxed mb-8 font-light">
              If you are seeking a special book for your collection, Kollect-It
              offers exceptional options for serious collectors.
            </p>

            <Link
              href="/category/antique-books"
              className="inline-block bg-lux-gold text-lux-black font-medium px-10 py-4 rounded hover:bg-lux-gold-light transition-colors text-lg"
            >
              Explore Rare Books 
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/images/featured-rare-books.jpg"
              alt="Collection of rare and historical leather-bound books from the 16th-19th century"
            />
          </div>
        </div>
      </div>
    </section>
  );
}