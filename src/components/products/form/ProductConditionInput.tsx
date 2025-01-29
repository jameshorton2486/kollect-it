import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ProductConditionInputProps {
  form: UseFormReturn<any>;
}

export function ProductConditionInput({ form }: ProductConditionInputProps) {
  return (
    <FormField
      control={form.control}
      name="condition"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Condition</FormLabel>
          <FormControl>
            <Input placeholder="Product condition" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}