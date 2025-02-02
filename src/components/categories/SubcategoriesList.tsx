import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { UseFieldArrayReturn, Control } from "react-hook-form";

interface SubcategoriesListProps {
  fields: UseFieldArrayReturn<{
    subcategories?: { value?: string }[];
    description?: string;
    name?: string;
  }>["fields"];
  append: UseFieldArrayReturn<{
    subcategories?: { value?: string }[];
    description?: string;
    name?: string;
  }>["append"];
  remove: UseFieldArrayReturn<{
    subcategories?: { value?: string }[];
    description?: string;
    name?: string;
  }>["remove"];
  control: Control<{
    subcategories?: { value?: string }[];
    description?: string;
    name?: string;
  }>;
}

export function SubcategoriesList({ fields, append, remove, control }: SubcategoriesListProps) {
  return (
    <Card className="p-6">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between">
          <FormLabel className="text-base font-semibold">Subcategories (Optional)</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ value: "" })}
            className="flex items-center gap-2"
            aria-label="Add subcategory"
          >
            <Plus className="h-4 w-4" />
            Add Subcategory
          </Button>
        </div>

        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`subcategories.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      placeholder="Enter subcategory name" 
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        field.onChange(e.target.value.trim());
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label={`Remove subcategory ${index + 1}`}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {!fields.length && (
          <p className="text-sm text-muted-foreground">
            No subcategories added yet. Click the button above to add one.
          </p>
        )}
      </CardContent>
    </Card>
  );
}