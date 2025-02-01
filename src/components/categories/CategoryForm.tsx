import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subcategories: z.array(z.string()).min(1, "At least one subcategory is required"),
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
      subcategories: [""],
    },
  });

  const addSubcategory = () => {
    const currentSubcategories = form.getValues("subcategories");
    form.setValue("subcategories", [...currentSubcategories, ""]);
  };

  const removeSubcategory = (index: number) => {
    const currentSubcategories = form.getValues("subcategories");
    form.setValue(
      "subcategories",
      currentSubcategories.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Subcategories</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSubcategory}
            >
              Add Subcategory
            </Button>
          </div>

          {form.watch("subcategories").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`subcategories.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="Enter subcategory name" {...field} />
                    </FormControl>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeSubcategory(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit" className="w-full bg-shop-accent1 hover:bg-shop-accent1/90">
          Create Category
        </Button>
      </form>
    </Form>
  );
}