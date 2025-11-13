import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductGallery from '@/components/product/ProductGallery';
import ProductDetails from '@/components/product/ProductDetails';
import RelatedProducts from '@/components/product/RelatedProducts';

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          name: true,
          id: true,
        }
      },
      images: {
        select: {
          url: true,
          alt: true,
        }
      }
    }
  });

  return product;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const related = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
      status: 'active'
    },
    take: 4,
    include: {
      images: {
        take: 1,
        select: {
          url: true,
        }
      }
    }
  });

  return related;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Gallery */}
        <ProductGallery
          images={product.images}
          productName={product.title}
        />

        {/* Details */}
        <ProductDetails product={product} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
}
