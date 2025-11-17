import Hero from "@/components/Hero";
import LatestArrivals from "@/components/home/LatestArrivalsClient";
import ShopByCategories from "@/components/home/ShopByCategoriesClient";
import TrustStrip from "@/components/home/TrustStrip";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Lazy load heavy components for faster initial page load
// These components are below the fold and don't need to be in the initial bundle
const LazyFeaturedCollection = dynamic(
  () => import("@/components/home/FeaturedCollection"),
  {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
    ssr: true,
  },
);

const LazyTestimonials = dynamic(
  () => import("@/components/home/Testimonials"),
  {
    loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
    ssr: true,
  },
);

const LazyProcessOverview = dynamic(
  () => import("@/components/home/ProcessOverview"),
  {
    loading: () => <div className="h-80 bg-gray-100 animate-pulse" />,
    ssr: true,
  },
);

export const metadata: Metadata = {
  title: "Kollect-It • Collectibles Worth Collecting",
  description:
    "Professionally described, fairly priced, personally curated. Browse rare books, fine art, collectibles, and militaria from $500-$15,000.",
  openGraph: {
    title: "Kollect-It • Collectibles Worth Collecting",
    description:
      "Professionally described, fairly priced, personally curated. Browse rare books, fine art, collectibles, and militaria from $500-$15,000.",
    url: "https://kollect-it.com/",
    siteName: "Kollect-It",
    images: [
      {
        url: "https://ext.same-assets.com/kollect-it/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Kollect-It – Curated Antiques & Collectibles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kollect-It • Collectibles Worth Collecting",
    description:
      "Professionally described, fairly priced, personally curated collectibles.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
  },
};

export default function HomePage() {
  return (
    <main className="bg-white" role="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Kollect-It",
            url: "https://kollect-it.com",
            logo: "https://ext.same-assets.com/kollect-it/logo.png",
            sameAs: [
              "https://www.instagram.com/",
              "https://www.facebook.com/",
              "https://www.youtube.com/",
            ],
          }),
        }}
      />
      <Hero />
      <TrustStrip />
      <LatestArrivals />
      <LazyFeaturedCollection />
      <ShopByCategories />
      <LazyTestimonials />
      <LazyProcessOverview />
    </main>
  );
}

