
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SellerTypeFilterProps {
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export function SellerTypeFilter({
  selectedType,
  onTypeChange,
}: SellerTypeFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-shop-800">Seller Type</h3>
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select seller type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sellers</SelectItem>
          <SelectItem value="verified">Verified Sellers</SelectItem>
          <SelectItem value="auction">Auction Houses</SelectItem>
          <SelectItem value="individual">Individual Sellers</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
