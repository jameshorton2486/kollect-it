import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function FeaturedCollection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-accent-gold" strokeWidth={1.5} />
              <p className="text-sm font-semibold text-accent-gold uppercase tracking-widest">
                Featured Collection
              </p>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-6 leading-tight">
              Treasures of the Archive: Rare Books & First Editions
            </h2>

            <p className="text-lg text-ink-light leading-relaxed mb-4">
              From leather-bound 17th-century volumes to coveted first editions and signed manuscripts, our rare book collection represents centuries of literary heritage. Each volume has been authenticated, and documented with complete available provenance.
            </p>

            <p className="text-lg text-ink-light leading-relaxed mb-8">
              Whether you're building a distinguished library or seeking that special book for your collection, Kollect-It offers exceptional editions for discerning bibliophiles.
            </p>

            <Link
              href="/category/antique-books"
              className="inline-block bg-accent-gold text-white font-semibold px-10 py-4 rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              Explore Rare Books →
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://ik.imagekit.io/kollectit/feature-rare-books-17th-modern.jpg"
              alt="Shelf mix of 17th-century leather-bound volumes alongside notable 20th-century editions"
              width={1200}
              height={900}
              className="w-full h-96 md:h-full object-cover hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
