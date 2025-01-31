import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ChevronRight } from "lucide-react";

interface ProductListingHeaderProps {
  title: string;
  description?: string;
}

export function ProductListingHeader({ title, description }: ProductListingHeaderProps) {
  return (
    <div className="mb-8">
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: title }
        ]} 
      />
      <h1 className="text-4xl font-bold mt-4">{title}</h1>
      {description && <p className="text-gray-600 mt-2">{description}</p>}
    </div>
  );
}