import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const SAMPLE_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Oil Paintings",
    description: "Beautiful oil paintings from various artists",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Fur Coats",
    description: "Luxury fur coats and accessories",
    imageUrl: "/placeholder.svg"
  }
];

export default function Categories() {
  const [categories, setCategories] = React.useState<Category[]>(SAMPLE_CATEGORIES);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Image uploaded:", file.name);
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
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-shop-700">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Category name"
                    className="border-shop-200 focus:border-shop-500 focus:ring-shop-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-shop-700">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Category description"
                    className="border-shop-200 focus:border-shop-500 focus:ring-shop-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image" className="text-shop-700">Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("image")?.click()}
                      className="w-full border-dashed border-2 border-shop-300 hover:border-shop-500 hover:bg-shop-50"
                    >
                      <Upload className="mr-2 h-4 w-4 text-shop-600" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-shop-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
            >
              <div className="aspect-square relative overflow-hidden bg-shop-100">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
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