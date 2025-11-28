import Image from "next/image";
import Link from "next/link";

const FEATURED_ITEMS = [
  {
    title: "Curated Fine Art",
    subtitle: "Paintings, prints, and works on paper",
    description:
      "Gallery-caliber pieces with documented provenance, spanning American, European, and modern schools.",
    href: "/category/fine-art",
    imageSrc: "/images/categories/art.svg",
    imageAlt: "Fine art icon",
  },
  {
    title: "Historic Collectibles",
    subtitle: "Ephemera, posters, and rare objects",
    description:
      "From early advertising to counterculture posters—objects that capture a moment in time.",
    href: "/category/collectibles",
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
    <section className="bg-surface-800 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
              Featured Collections
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Curated capsules for serious collectors
            </h2>
            <p className="text-sm leading-relaxed text-white/80">
              Groupings are drawn from estates, studio archives, and private
              consignments—so you can acquire pieces that converse with one
              another in your space.
            </p>
          </div>
          <p className="text-sm text-white/70">
            Each capsule includes documented condition notes and provenance
            context so you can act quickly on the pieces you love.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_ITEMS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/95 shadow-[0_14px_45px_rgba(15,15,15,0.35)] transition hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-lux-ink-soft">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5 pt-4 text-ink-900">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ink-400">
                  {item.subtitle}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink-500 group-hover:text-ink-900">
                  Explore collection
                  <span aria-hidden className="text-[0.8rem]">
                    ↗
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
