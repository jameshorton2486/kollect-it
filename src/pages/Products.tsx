import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Upload, Search, Filter, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  imageUrl: string;
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Vintage Oil Painting",
    description: "Beautiful landscape from the 1950s",
    price: 1200,
    condition: "Good",
    category: "Fine Art",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Antique Pocket Watch",
    description: "18k gold pocket watch from 1890",
    price: 3500,
    condition: "Excellent",
    category: "Collectibles",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Art Deco Vase",
    description: "Rare ceramic vase from the 1920s",
    price: 850,
    condition: "Very Good",
    category: "Antiques",
    imageUrl: "/placeholder.svg"
  }
];

const CATEGORIES = ["All", "Fine Art", "Collectibles", "Antiques"];
const CONDITIONS = ["All", "Excellent", "Very Good", "Good", "Fair"];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesCondition = selectedCondition === "All" || product.condition === selectedCondition;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-shop-800">Products</h1>
            <p className="text-shop-500 mt-1">Manage your collectibles and fine art</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-shop-700 hover:bg-shop-800 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-shop-800">Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Product name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Product description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Input id="condition" placeholder="e.g., Excellent, Good" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" placeholder="e.g., Fine Art, Collectibles" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Images</Label>
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
                      className="w-full border-dashed border-2 border-shop-300 hover:border-shop-500 hover:bg-shop-50"
                    >
                      <Upload className="mr-2 h-4 w-4 text-shop-600" />
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
                  className="pl-10 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Condition</Label>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Range (${priceRange[0]} - ${priceRange[1]})</Label>
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
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square relative overflow-hidden bg-shop-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-shop-800">{product.name}</h3>
                  <span className="text-lg font-bold text-shop-700">${product.price.toLocaleString()}</span>
                </div>
                <p className="text-shop-600 mb-2">{product.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-shop-500">Condition: {product.condition}</span>
                  <span className="text-shop-500">{product.category}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}