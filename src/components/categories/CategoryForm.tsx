import { useForm, useFieldArray } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  subcategories: z.array(
    z.string().min(2, "Subcategory must be at least 2 characters")
  ).default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
}

export function CategoryForm({ onSubmit }: CategoryFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      subcategories: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subcategories",
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      console.log("Submitting category with values:", values);
      await onSubmit(values);
      
      form.reset();
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="p-6">
          <CardContent className="space-y-4 p-0">
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
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="space-y-4 p-0">
            <div className="flex items-center justify-between">
              <FormLabel className="text-base font-semibold">Subcategories (Optional)</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append("")}
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
                control={form.control}
                name={`subcategories.${index}`}
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

            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No subcategories added yet. Click the button above to add one.
              </p>
            )}
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full bg-shop-accent1 hover:bg-shop-accent1/90"
        >
          Create Category
        </Button>
      </form>
    </Form>
  );
}