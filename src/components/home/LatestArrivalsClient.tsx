"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LatestArrivals() {
  const items = [
    {
      title: "19th-C. Gilt Frame Mirror",
      img: "https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=Victorian+Mirror",
      desc: "Victorian • London • c. 1880",
      category: "Mirrors & Glass",
      slug: "mirror-1",
      condition: "Excellent",
      authenticated: true,
    },
    {
      title: "Art Deco Bronze Figurine",
      img: "https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=Art+Deco+Figurine",
      desc: "France • c. 1930",
      category: "Sculpture",
      slug: "figurine-1",
      condition: "Fine",
      authenticated: true,
    },
    {
      title: "Stanley Mouse 1966 Poster",
      img: "https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=1966+Poster",
      desc: "Jefferson Airplane • Original",
      category: "Posters & Art",
      slug: "poster-1",
      condition: "Very Good",
      authenticated: true,
    },
    {
      title: "Tsavorite Garnet 6.12 ct",
      img: "https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=Tsavorite+Garnet",
      desc: "Merelani Hills • Tanzania",
      category: "Gemstones",
      slug: "garnet-1",
      condition: "Excellent",
      authenticated: true,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-surface-0">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm md:text-base font-semibold text-gold uppercase tracking-widest mb-3">
            What's New This Week
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4">
            Latest Arrivals
          </h2>
          <p className="text-lg text-ink-light max-w-2xl mx-auto">
            Newly authenticated pieces added to our collection. Each item is
            documented, certified, and ready to join your collection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/product/${item.slug}`} className="block">
                <div className="relative overflow-hidden rounded-lg mb-4 bg-surface-2">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Authentication badge */}
                  <div className="absolute top-3 right-3 bg-gold text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Authenticated
                  </div>

                  {/* Condition badge */}
                  <div className="absolute bottom-3 left-3 bg-surface-0/90 backdrop-blur text-ink px-3 py-1 rounded-full text-xs font-medium">
                    {item.condition}
                  </div>
                </div>
              </Link>

              <p className="text-xs text-gold font-semibold uppercase tracking-wide mb-2">
                {item.category}
              </p>
              <h3 className="font-serif text-lg text-ink mb-1 group-hover:text-gold transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-ink-light mb-3">{item.desc}</p>

              <Link
                href={`/product/${item.slug}`}
                className="text-gold text-sm font-semibold hover:text-gold-dark transition-colors inline-flex items-center gap-2"
              >
                View Details →
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-ink-light text-lg mb-6 max-w-2xl mx-auto">
            Each piece tells a story of craftsmanship and heritage. Our
            specialists continually source exceptional treasures to elevate your
            personal collection.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-gold text-white font-semibold px-10 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Explore Full Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

