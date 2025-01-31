import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductListingSortProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function ProductListingSort({ sortBy, onSortChange }: ProductListingSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-shop-600">Sort by:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select sorting" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at_desc">Newest First</SelectItem>
          <SelectItem value="created_at_asc">Oldest First</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="name_asc">Name: A to Z</SelectItem>
          <SelectItem value="name_desc">Name: Z to A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}