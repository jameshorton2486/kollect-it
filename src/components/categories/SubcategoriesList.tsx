import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, AlertCircle } from "lucide-react";
import { UseFieldArrayReturn, Control } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

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
          <FormLabel className="text-base font-semibold">Subcategories</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ value: "" })}
            className="flex items-center gap-2 hover:bg-shop-accent1/10 hover:text-shop-accent1"
            aria-label="Add subcategory"
          >
            <Plus className="h-4 w-4" />
            Add Subcategory
          </Button>
        </div>

        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FormField
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
                          className="hover:border-shop-accent1/50 focus:border-shop-accent1"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        aria-label={`Remove subcategory ${index + 1}`}
                        className="hover:bg-destructive/90"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {!fields.length && (
          <div className="flex items-center gap-2 text-muted-foreground p-4 bg-muted/50 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">
              No subcategories added yet. Click the button above to add one.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}