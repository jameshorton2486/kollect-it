import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload } from "lucide-react";

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
      // Here we'll handle image upload and standardization
      console.log("Image uploaded:", file.name);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Category name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Category description" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
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
                  >
                    <Upload className="mr-2 h-4 w-4" />
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
            className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="aspect-square mb-4 rounded-md overflow-hidden bg-muted">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}