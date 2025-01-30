import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConditionFilterProps {
  selectedCondition: string;
  onConditionChange: (value: string) => void;
}

export function ConditionFilter({
  selectedCondition,
  onConditionChange,
}: ConditionFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-shop-800">Condition</h3>
      <Select value={selectedCondition} onValueChange={onConditionChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Conditions</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="like-new">Like New</SelectItem>
          <SelectItem value="excellent">Excellent</SelectItem>
          <SelectItem value="good">Good</SelectItem>
          <SelectItem value="fair">Fair</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}