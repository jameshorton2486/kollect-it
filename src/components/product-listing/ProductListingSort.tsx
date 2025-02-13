
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ProductListingSortProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ProductListingSort({ value, onValueChange }: ProductListingSortProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="created_at_desc">Newest First</SelectItem>
        <SelectItem value="created_at_asc">Oldest First</SelectItem>
      </SelectContent>
    </Select>
  );
}
