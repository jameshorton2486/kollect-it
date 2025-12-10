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

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      category: true,
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

  const description =
    product.description.slice(0, 160) ||
    `Authenticated ${product.category.name.toLowerCase()} from Kollect-It. Carefully curated and quality-reviewed.`;

  const imageUrl = product.images[0]?.url || "/og-default.jpg";
  const canonicalUrl = `https://kollect-it.com/product/${product.slug}`;

  return {
    title: `${product.title} | Kollect-It`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      title: product.title,
      description,
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
      title: product.title,
      description,
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
    { label: product.category.name, href: `/category/${product.category.slug}` },
    { label: product.title },
  ];

  const stickyProductData = {
    id: product.id,
    title: product.title,
    price: product.price,
    slug: product.slug,
    image: product.images[0]?.url || "/placeholder.svg",
    categoryName: product.category.name,
  };

  // Generate structured data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.status === "active" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://kollect-it.com/product/${product.slug}`,
    },
    category: product.category.name,
    brand: {
      "@type": "Brand",
      name: "Kollect-It",
    },
    ...(product.condition && { itemCondition: product.condition }),
    ...(product.year && { releaseDate: product.year }),
    ...(product.artist && { manufacturer: { "@type": "Organization", name: product.artist } }),
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
                images={product.images}
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
              images: p.images || [],
              category: { name: "Featured" },
            }))}
            categoryName={product.category.name}
          />
        )}
      </main>
    </ClientProductLayout>
  );
}
