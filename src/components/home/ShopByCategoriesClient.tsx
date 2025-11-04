"use client";"use client";"use client";



import { motion } from "framer-motion";

import Image from "next/image";

import Link from "next/link";import { motion } from "framer-motion";import { motion } from "framer-motion";

import { ArrowRight } from "lucide-react";

import Image from "next/image";import Image from "next/image";

export default function ShopByCategories() {

  const categories = [import Link from "next/link";import Link from "next/link";

    {

      title: "Antique Books",import { ArrowRight } from "lucide-react";

      desc: "Rare first editions and beautifully bound volumes from across centuries.",

      items: "500+ items",export default function ShopByCategories() {

      img: "https://ik.imagekit.io/kollectit/cat-books.jpg",

      href: "/category/antique-books",export default function ShopByCategories() {  const categories = [

    },

    {  const categories = [    {

      title: "Fine Art",

      desc: "Original paintings, drawings, and sculptures from documented artists.",    {      title: "Antique Books",

      items: "300+ items",

      img: "https://ik.imagekit.io/kollectit/cat-art.jpg",      title: "Antique Books",      desc: "Scarce first editions and beautifully bound volumes.",

      href: "/category/fine-art",

    },      desc: "Rare first editions and beautifully bound volumes from across centuries.",      img: "https://ik.imagekit.io/kollectit/cat-books.jpg",

    {

      title: "Collectibles",      items: "500+ items",      href: "/category/antique-books",

      desc: "Vintage timepieces, memorabilia, and ephemera with verified authenticity.",

      items: "1000+ items",      img: "https://ik.imagekit.io/kollectit/cat-books.jpg",    },

      img: "https://ik.imagekit.io/kollectit/cat-collectibles.jpg",

      href: "/category/collectibles",      href: "/category/antique-books",    {

    },

    {    },      title: "Fine Art",

      title: "Furniture",

      desc: "Museum-quality pieces from Art Deco to Mid-Century Modern and beyond.",    {      desc: "Paintings, drawings, and sculpture from documented artists.",

      items: "200+ items",

      img: "https://ik.imagekit.io/kollectit/cat-furniture.jpg",      title: "Fine Art",      img: "https://ik.imagekit.io/kollectit/cat-art.jpg",

      href: "/category/furniture",

    },      desc: "Original paintings, drawings, and sculptures from documented artists.",      href: "/category/fine-art",

    {

      title: "Decorative Arts",      items: "300+ items",    },

      desc: "Ceramics, glass, textiles, and metalwork from around the world.",

      items: "400+ items",      img: "https://ik.imagekit.io/kollectit/cat-art.jpg",    {

      img: "https://ik.imagekit.io/kollectit/cat-decorative.jpg",

      href: "/category/decorative-arts",      href: "/category/fine-art",      title: "Collectibles",

    },

    {    },      desc: "Rare memorabilia, vintage timepieces, and ephemera.",

      title: "Militaria",

      desc: "Historical artifacts with verified provenance and documented authenticity.",    {      img: "https://ik.imagekit.io/kollectit/cat-collectibles.jpg",

      items: "150+ items",

      img: "https://ik.imagekit.io/kollectit/cat-militaria.jpg",      title: "Collectibles",      href: "/category/collectibles",

      href: "/category/militaria",

    },      desc: "Vintage timepieces, memorabilia, and ephemera with verified authenticity.",    },

  ];

      items: "1000+ items",    {

  return (

    <section className="py-16 md:py-24 bg-white">      img: "https://ik.imagekit.io/kollectit/cat-collectibles.jpg",      title: "Militaria",

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">

        <motion.div      href: "/category/collectibles",      desc: "Artifacts with verified provenance and historical importance.",

          className="text-center mb-14"

          initial={{ opacity: 0, y: 20 }}    },      img: "https://ik.imagekit.io/kollectit/cat-militaria.jpg",

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}    {      href: "/category/militaria",

          transition={{ duration: 0.6 }}

        >      title: "Furniture",    },

          <p className="text-sm md:text-base font-semibold text-accent-gold uppercase tracking-widest mb-3">

            Explore Collections      desc: "Museum-quality pieces from Art Deco to Mid-Century Modern and beyond.",  ];

          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4">      items: "200+ items",

            Shop by Category

          </h2>      img: "https://ik.imagekit.io/kollectit/cat-furniture.jpg",  return (

          <p className="text-lg text-ink-light max-w-2xl mx-auto">

            Browse our carefully curated categories. Every piece has been authenticated and documented for your confidence.      href: "/category/furniture",    <section className="section-spacing bg-cream">

          </p>

        </motion.div>    },      <div className="container mx-auto px-6 max-w-6xl text-center">



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">    {        <h2 className="text-4xl text-navy font-semibold mb-6">

          {categories.map((cat, i) => (

            <motion.div      title: "Decorative Arts",          Shop by Category

              key={i}

              initial={{ opacity: 0, y: 40 }}      desc: "Ceramics, glass, textiles, and metalwork from around the world.",        </h2>

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}      items: "400+ items",  <p className="text-ink-secondary mb-12">

              transition={{ duration: 0.6, delay: i * 0.1 }}

            >      img: "https://ik.imagekit.io/kollectit/cat-decorative.jpg",          Explore diverse categories curated for collectors, designers, and

              <Link

                href={cat.href}      href: "/category/decorative-arts",          historians alike.

                className="flex flex-col bg-white rounded-lg overflow-hidden border border-surface-2 hover:border-accent-gold transition-all duration-300 hover:shadow-lg h-full group"

              >    },        </p>

                <div className="relative overflow-hidden h-56 bg-surface-2">

                  <Image    {

                    src={cat.img}

                    alt={cat.title}      title: "Militaria",        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

                    width={600}

                    height={400}      desc: "Historical artifacts with verified provenance and documented authenticity.",          {categories.map((cat, i) => (

                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"

                  />      items: "150+ items",            <motion.div

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                </div>      img: "https://ik.imagekit.io/kollectit/cat-militaria.jpg",              key={i}



                <div className="p-6 flex flex-col flex-grow">      href: "/category/militaria",              initial={{ opacity: 0, y: 40 }}

                  <h3 className="font-serif text-2xl text-ink mb-2 group-hover:text-accent-gold transition-colors">

                    {cat.title}    },              whileInView={{ opacity: 1, y: 0 }}

                  </h3>

                  <p className="text-ink-light text-sm leading-relaxed mb-4 flex-grow">  ];              viewport={{ once: true }}

                    {cat.desc}

                  </p>              transition={{ duration: 0.6, delay: i * 0.1 }}



                  <div className="flex items-center justify-between pt-4 border-t border-surface-2">  return (            >

                    <span className="text-xs text-accent-gold font-semibold uppercase tracking-wider">

                      {cat.items}    <section className="py-16 md:py-24 bg-white">              <Link

                    </span>

                    <ArrowRight className="h-4 w-4 text-accent-gold group-hover:translate-x-1 transition-transform" />      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">                href={cat.href}

                  </div>

                </div>        <motion.div                className="group block border border-gray-200 rounded-2xl overflow-hidden shadow-elevation-sm hover:shadow-elevation-lg transition-all duration-300 bg-white"

              </Link>

            </motion.div>          className="text-center mb-14"              >

          ))}

        </div>          initial={{ opacity: 0, y: 20 }}                <Image



        <motion.div          whileInView={{ opacity: 1, y: 0 }}                  src={cat.img}

          className="mt-16 text-center"

          initial={{ opacity: 0, y: 20 }}          viewport={{ once: true }}                  alt={cat.title}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}          transition={{ duration: 0.6 }}                  width={600}

          transition={{ duration: 0.8 }}

        >        >                  height={400}

          <p className="text-ink-light text-lg mb-8 max-w-2xl mx-auto">

            Whether you're curating a personal gallery or completing a collection, discover treasures across every category. With over 2,500 authenticated pieces, your next acquisition is just a click away.          <p className="text-sm md:text-base font-semibold text-accent-gold uppercase tracking-widest mb-3">                  className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-500"

          </p>

          <Link            Explore Collections                />

            href="/shop"

            className="inline-block bg-accent-gold text-white font-semibold px-10 py-3 rounded-lg hover:opacity-90 transition-opacity text-lg"          </p>                <div className="p-6 text-left">

          >

            Browse Full Inventory          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4">                  <h3 className="text-2xl text-navy mb-2">

          </Link>

        </motion.div>            Shop by Category                    {cat.title}

      </div>

    </section>          </h2>                  </h3>

  );

}          <p className="text-lg text-ink-light max-w-2xl mx-auto">                  <p className="text-ink-secondary leading-relaxed">


            Browse our carefully curated categories. Every piece has been authenticated and documented for your confidence.                    {cat.desc}

          </p>                  </p>

        </motion.div>                </div>

              </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">            </motion.div>

          {categories.map((cat, i) => (          ))}

            <motion.div        </div>

              key={i}

              initial={{ opacity: 0, y: 40 }}        <div className="mt-10 text-center">

              whileInView={{ opacity: 1, y: 0 }}          <Link

              viewport={{ once: true }}            href="/shop"

              transition={{ duration: 0.6, delay: i * 0.1 }}            className="text-[13px] uppercase tracking-wide text-brand-gold underline underline-offset-4 hover:text-brand-gold/90 transition-colors"

            >          >

              <Link            View All Categories

                href={cat.href}          </Link>

                className="group block bg-white rounded-lg overflow-hidden border border-surface-2 hover:border-accent-gold transition-all duration-300 hover:shadow-lg h-full flex flex-col"        </div>

              >

                {/* Image */}        <motion.p

                <div className="relative overflow-hidden h-56 bg-surface-2">          className="mt-10 text-ink-secondary text-lg max-w-2xl mx-auto"

                  <Image          initial={{ opacity: 0, y: 20 }}

                    src={cat.img}          whileInView={{ opacity: 1, y: 0 }}

                    alt={cat.title}          viewport={{ once: true }}

                    width={600}          transition={{ duration: 0.8 }}

                    height={400}        >

                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"          Whether you’re building a personal gallery or enhancing a curated

                  />          space, Kollect-It makes discovery effortless with authenticity at its

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />          core.

                </div>        </motion.p>

      </div>

                {/* Content */}    </section>

                <div className="p-6 flex flex-col flex-grow">  );

                  <h3 className="font-serif text-2xl text-ink mb-2 group-hover:text-accent-gold transition-colors">}

                    {cat.title}
                  </h3>
                  <p className="text-ink-light text-sm leading-relaxed mb-4 flex-grow">
                    {cat.desc}
                  </p>

                  {/* Item count and arrow */}
                  <div className="flex items-center justify-between pt-4 border-t border-surface-2">
                    <span className="text-xs text-accent-gold font-semibold uppercase tracking-wider">
                      {cat.items}
                    </span>
                    <ArrowRight className="h-4 w-4 text-accent-gold group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-ink-light text-lg mb-8 max-w-2xl mx-auto">
            Whether you're curating a personal gallery or completing a collection, discover treasures across every category. With over 2,500 authenticated pieces, your next acquisition is just a click away.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-accent-gold text-white font-semibold px-10 py-3 rounded-lg hover:opacity-90 transition-opacity text-lg"
          >
            Browse Full Inventory
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
