import Image from "next/image";
import Link from "next/link";

const FEATURED_ITEMS = [
  {
    title: "Curated Fine Art",
    subtitle: "Paintings, prints, and works on paper",
    description:
      "Gallery-caliber pieces with documented provenance, spanning American, European, and modern schools.",
    href: "/categories/fine-art",
    imageSrc: "/images/categories/art.svg",
    imageAlt: "Fine art icon",
  },
  {
    title: "Historic Collectibles",
    subtitle: "Ephemera, posters, and rare objects",
    description:
      "From early advertising to counterculture posters—objects that capture a moment in time.",
    href: "/categories/collectibles",
    imageSrc: "/images/products/placeholder.svg",
    imageAlt: "Collectible object icon",
  },
  {
    title: "Decor & Objects",
    subtitle: "Design, sculpture, and statement pieces",
    description:
      "Sculptural forms, studio ceramics, and design-forward objects that anchor a room.",
    href: "/browse?tag=decor",
    imageSrc: "/images/categories/militaria.svg",
    imageAlt: "Decor and object icon",
  },
];

export default function FeaturedCollection() {
  return (
    <section className="bg-lux-cream py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-lux-gold uppercase">
              Featured Collections
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-lux-black sm:text-3xl">
              Curated groupings for serious collectors
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-lux-gray-dark">
              We assemble collections around artists, estates, or themes so you
              can acquire pieces that speak to each other—visually, historically,
              and emotionally.
            </p>
          </div>
          <div className="text-sm text-lux-gray-dark/85 md:text-right">
            <p>Every item is evaluated for authenticity, condition, and fit.</p>
            <p className="mt-1">
              Explore groupings, then dive deeper into individual works.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_ITEMS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-lux-silver/40 bg-lux-white shadow-[0_14px_40px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-lux-gold hover:shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-lux-cream">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="object-contain p-6 transition group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                <div>
                  <p className="text-[0.72rem] font-semibold tracking-[0.20em] text-lux-gold uppercase">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-lux-black">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-lux-gray-dark">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 text-xs font-medium text-lux-gray-dark/85">
                  <span className="inline-flex items-center gap-2 group-hover:text-lux-black">
                    Explore collection
                    <span className="text-[0.7rem]">↗</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
