import { useForm, useFieldArray } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SubcategoriesList } from "./SubcategoriesList";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  subcategories: z.array(
    z.object({
      value: z.string().min(2, "Subcategory must be at least 2 characters")
    })
  ).default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  onSubmit: (values: { name: string; description?: string; subcategories: string[] }) => Promise<void>;
  defaultValues?: FormValues;
}

export function CategoryForm({ onSubmit, defaultValues }: CategoryFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
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
      await onSubmit({
        name: values.name,
        description: values.description,
        subcategories: values.subcategories.map(sub => sub.value),
      });
      if (!defaultValues) {
        form.reset();
      }
      toast.success(defaultValues ? "Category updated successfully" : "Category created successfully");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category. Please try again.");
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

        <SubcategoriesList
          fields={fields}
          append={append}
          remove={remove}
          control={form.control}
        />

        <Button 
          type="submit" 
          className="w-full bg-shop-accent1 hover:bg-shop-accent1/90"
        >
          {defaultValues ? "Update Category" : "Create Category"}
        </Button>
      </form>
    </Form>
  );
}