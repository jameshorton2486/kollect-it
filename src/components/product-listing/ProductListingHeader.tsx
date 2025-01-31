import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface ProductListingHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ProductListingHeader({ viewMode, onViewModeChange }: ProductListingHeaderProps) {
  return (
    <div className="space-y-4">
      <Breadcrumbs 
        items={[
          { label: "Home", href: "/" },
          { label: "Products" }
        ]} 
      />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-shop-800">
          Explore Our Collection
        </h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}