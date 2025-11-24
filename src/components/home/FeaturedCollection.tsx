import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function FeaturedCollection() {
  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen
                className="h-5 w-5 text-gold-400"
                strokeWidth={1.5}
              />
              <p className="text-sm font-semibold text-gold-400 uppercase tracking-widest">
                Featured Collection
              </p>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
              Treasures of the Archive: Rare Books & First Editions
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              From leather-bound volumes dating back to the 17th century to
              first editions and manuscripts, our rare book collection
              represents centuries of literary heritage. Each volume has been
              authenticated and documented with care.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              If you are seeking a special book for your collection, Kollect-It
              offers exceptional options for serious collectors.
            </p>

            <Link
              href="/category/antique-books"
              className="inline-block bg-gold-400 text-gray-900 font-semibold px-10 py-4 rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              Explore Rare Books →
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <Image
              src="https://via.placeholder.com/1200x900/8B4513/FFFFFF?text=Rare+Books+Collection"
              alt="Collection of rare and historical Virgil volumes, 16th–19th century leather-bound books."
              width={1200}
              height={900}
              className="w-full h-96 md:h-full object-cover hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

