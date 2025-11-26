import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import ClientProductLayout from '@/components/product/ClientProductLayout';
// Import your Prisma client or data fetching utilities
// import { prisma } from '@/lib/prisma';

// Dynamically import other components (these can stay server-side)
const ProductGallery = dynamic(() => import('@/components/product/ProductGallery'));
const ProductInfo = dynamic(() => import('@/components/product/ProductInfo'));
const ProductTabs = dynamic(() => import('@/components/product/ProductTabs'));
const RelatedProducts = dynamic(() => import('@/components/product/RelatedProducts'));

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // TODO: Replace with your actual data fetching logic
  // Example with Prisma:
  // const product = await prisma.product.findUnique({
  //   where: { slug },
  //   include: {
  //     images: true,
  //     category: true,
  //     // ... other relations
  //   },
  // });
  
  // For now, using placeholder - replace with your actual data fetching
  const product = null; // Replace with actual fetching
  
  if (!product) {
    notFound();
  }
  
  return (
    <ClientProductLayout product={product}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Gallery */}
          <ProductGallery images={product.images} />
          
          {/* Product Info */}
          <ProductInfo product={product} />
        </div>
        
        {/* Product Tabs */}
        <ProductTabs product={product} />
        
        {/* Related Products */}
        <RelatedProducts category={product.category} />
      </div>
    </ClientProductLayout>
  );
}

// Optional: Generate static params for static generation
// export async function generateStaticParams() {
//   const products = await prisma.product.findMany({
//     select: { slug: true },
//   });
//   
//   return products.map((product) => ({
//     slug: product.slug,
//   }));
// }

// Optional: Generate metadata for SEO
// export async function generateMetadata({ params }: ProductPageProps) {
//   const { slug } = await params;
//   const product = await prisma.product.findUnique({
//     where: { slug },
//   });
//   
//   if (!product) {
//     return {};
//   }
//   
//   return {
//     title: `${product.name} | Kollect-It`,
//     description: product.description,
//     openGraph: {
//       title: product.name,
//       description: product.description,
//       images: [product.images?.[0]?.url],
//     },
//   };
// }
