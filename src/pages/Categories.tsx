import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export default function Categories() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.from("categories").insert([
        {
          name: values.name,
          description: values.description || null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });

      form.reset();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the category.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-shop-800">Categories</h1>
            <p className="text-shop-500 mt-1">Manage your store categories</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-shop-700 hover:bg-shop-800 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-shop-800">Add New Category</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category name" {...field} />
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Category description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Create Category</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-shop-200 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-shop-800 mb-2">{category.name}</h3>
                <p className="text-shop-600">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}