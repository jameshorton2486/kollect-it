import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Upload, Search, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  condition: string;
  category: { id: string; name: string };
  category_id: string;
  imageUrl: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch products with category information
  const { data: products = [] } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name)
        `);

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = selectedCondition === "All" || product.condition === selectedCondition;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCondition && matchesPrice;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-shop-50 to-shop-100 p-8 rounded-xl shadow-md">
          <div>
            <h1 className="text-4xl font-bold text-shop-800 bg-gradient-to-r from-shop-700 to-shop-800 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-shop-600 mt-2 text-lg">
              Manage your collectibles and fine art
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-shop-600 to-shop-700 hover:from-shop-700 hover:to-shop-800 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-shop-800 bg-gradient-to-r from-shop-700 to-shop-800 bg-clip-text text-transparent">
                  Add New Product
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-shop-700">Name</Label>
                    <Input id="name" placeholder="Product name" className="border-shop-200 focus:border-shop-400" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price" className="text-shop-700">Price ($)</Label>
                    <Input id="price" type="number" placeholder="0.00" className="border-shop-200 focus:border-shop-400" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-shop-700">Description</Label>
                  <Input id="description" placeholder="Product description" className="border-shop-200 focus:border-shop-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="condition" className="text-shop-700">Condition</Label>
                    <Input id="condition" placeholder="e.g., Excellent, Good" className="border-shop-200 focus:border-shop-400" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-shop-700">Category</Label>
                    <Input id="category" placeholder="e.g., Fine Art, Collectibles" className="border-shop-200 focus:border-shop-400" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image" className="text-shop-700">Images</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("image")?.click()}
                      className="w-full border-dashed border-2 border-shop-300 hover:border-shop-500 hover:bg-shop-50 text-shop-600 transition-all duration-300"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-shop-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 bg-white border-shop-200 focus:border-shop-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] bg-white border-shop-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-shop-200 hover:bg-shop-50 text-shop-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-shop-50 to-shop-100 rounded-xl shadow-sm animate-fadeIn">
              <div className="space-y-2">
                <Label className="text-shop-700">Condition</Label>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger className="border-shop-200 bg-white">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {["All", "Excellent", "Very Good", "Good", "Fair"].map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-shop-700">Price Range (${priceRange[0]} - ${priceRange[1]})</Label>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-6"
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-shop-200 hover:border-shop-300"
            >
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-shop-50 to-shop-100">
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-6 bg-gradient-to-b from-white to-shop-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-shop-800 group-hover:text-shop-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <span className="text-lg font-bold bg-gradient-to-r from-shop-600 to-shop-700 bg-clip-text text-transparent">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-shop-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="px-2 py-1 rounded-full bg-shop-100 text-shop-600">
                    {product.condition}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-shop-100 text-shop-600">
                    {product.category?.name || "Uncategorized"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Products;
