import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductInfo from "@/components/product/ProductInfo";
import ProductGallery from "@/components/product/ProductGallery";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import ClientProductLayout from "@/components/product/ClientProductLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getRecommendations } from "@/lib/recommendations";
import { generateSeoTitle, generateSeoDescription, generateCanonicalUrl } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      Image: {
        orderBy: { order: "asc" },
      },
      Category: true,
    },
  });

  return product;
}

export async function generateMetadata(
  props: ProductPageProps,
): Promise<Metadata> {
  const { params } = props;
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Kollect-It",
    };
  }

  // Use SEO fields if available, otherwise generate from product data
  const seoTitle = product.seoTitle 
    ? `${product.seoTitle} | Kollect-It`
    : generateSeoTitle(product.title);
  
  const seoDescription = product.seoDescription 
    ? product.seoDescription
    : generateSeoDescription(
        product.description,
        `Authenticated ${product.Category.name.toLowerCase()} from Kollect-It. Carefully curated and quality-reviewed.`
      );

  // Get primary image (first image) for OpenGraph - use ImageKit transformation
  const { getProductDetailImageUrl } = await import("@/lib/image-helpers");
  const baseImageUrl = product.Image[0]?.url || "/og-default.jpg";
  const imageUrl = baseImageUrl !== "/og-default.jpg" 
    ? getProductDetailImageUrl(baseImageUrl)
    : baseImageUrl;
  const canonicalUrl = generateCanonicalUrl(product.slug);

  // Add noindex for draft products
  const robots = product.isDraft 
    ? { index: false, follow: false }
    : undefined;

  return {
    title: seoTitle,
    description: seoDescription,
    robots,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      title: product.seoTitle || product.title,
      description: seoDescription,
      url: canonicalUrl,
      siteName: "Kollect-It",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.title,
      description: seoDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage(props: ProductPageProps) {
  const { params } = props;
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || product.status !== "active") {
    notFound();
  }

  // Get related products
  const relatedProducts = await getRecommendations(product.id, product.id, 6);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: product.Category.name, href: `/category/${product.Category.slug}` },
    { label: product.title },
  ];

  const stickyProductData = {
    id: product.id,
    title: product.title,
    price: product.price,
    slug: product.slug,
    image: product.Image[0]?.url || "/placeholder.svg",
    categoryName: product.Category.name,
  };

  // Generate structured data (JSON-LD) - Enhanced with SEO fields
  const canonicalUrl = generateCanonicalUrl(`/product/${product.slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.seoDescription || product.description,
    image: product.Image.map((img) => img.url),
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "USD",
      availability: product.status === "active" && !product.isDraft
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: canonicalUrl,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    },
    category: product.Category.name,
    brand: {
      "@type": "Brand",
      name: "Kollect-It",
    },
    ...(product.condition && { itemCondition: `https://schema.org/${product.condition}Condition` }),
    ...(product.year && { productionDate: product.year }),
    ...(product.artist && { manufacturer: { "@type": "Organization", name: product.artist } }),
    ...(product.rarity && { additionalProperty: { "@type": "PropertyValue", name: "rarity", value: product.rarity } }),
  };

  return (
    <ClientProductLayout product={stickyProductData}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="bg-lux-pearl">
        {/* Breadcrumbs */}
        <section className="border-b border-border-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </section>

        {/* Product Content */}
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column - Images */}
            <div>
              <ProductGallery
                images={product.Image}
                productName={product.title}
              />
            </div>

            {/* Right Column - Product Info */}
            <div>
              <ProductInfo product={product} sku={product.sku} />
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:pb-16">
          <ProductTabs product={product} />
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts
            products={relatedProducts.map((p) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              price: p.price,
              images: p.Image || [],
              Category: { name: "Featured" },
            }))}
            categoryName={product.Category.name}
          />
        )}
      </main>
    </ClientProductLayout>
  );
}
