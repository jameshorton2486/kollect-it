
import { Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CollectionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  collectionType: string;
  onCollectionTypeChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  onManageTags: () => void;
}

export function CollectionFilters({
  searchQuery,
  onSearchChange,
  collectionType,
  onCollectionTypeChange,
  sortBy,
  onSortByChange,
  onManageTags,
}: CollectionFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          className="pl-10" 
          placeholder="Search your collection..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={collectionType} onValueChange={onCollectionTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="saved">Saved</SelectItem>
            <SelectItem value="purchased">Purchased</SelectItem>
            <SelectItem value="wishlist">Wishlist</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onManageTags}>
          <Tag className="w-4 h-4 mr-2" />
          Manage Tags
        </Button>
      </div>
    </div>
  );
}
