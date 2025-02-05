
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface CategoryFormFieldsProps {
  form: UseFormReturn<any>;
}

export function CategoryFormFields({ form }: CategoryFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">Category Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter category name" 
                className="w-full"
                {...field} 
                onBlur={(e) => {
                  field.onBlur();
                  field.onChange(e.target.value.trim());
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">Description (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter category description" 
                className="w-full min-h-[100px] resize-y"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
