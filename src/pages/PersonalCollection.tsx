
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Grid, List, Plus, Search, Tag, Share2, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollectionItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description: string;
    condition: string;
  };
  collection_type: 'saved' | 'purchased' | 'wishlist';
  created_at: string;
  notes?: string;
}

export default function PersonalCollection() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionType, setCollectionType] = useState<"all" | "saved" | "purchased" | "wishlist">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price-high" | "price-low">("newest");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: collectionItems, isLoading } = useQuery({
    queryKey: ["personalCollection"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personal_collection_items")
        .select(`
          id,
          collection_type,
          created_at,
          notes,
          product:products (
            id,
            name,
            price,
            image_url,
            description,
            condition
          )
        `)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return data as CollectionItem[];
    },
  });

  const filteredItems = collectionItems?.filter((item) => {
    const matchesSearch = item.product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = collectionType === "all" || item.collection_type === collectionType;
    return matchesSearch && matchesType;
  });

  const sortedItems = [...(filteredItems || [])].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "price-high":
        return b.product.price - a.product.price;
      case "price-low":
        return a.product.price - b.product.price;
      default:
        return 0;
    }
  });

  const handleShare = (itemId: string) => {
    // Copy share link to clipboard
    const shareUrl = `${window.location.origin}/products/${itemId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "The share link has been copied to your clipboard.",
    });
  };

  const handleRemoveItems = async () => {
    const { error } = await supabase
      .from("personal_collection_items")
      .delete()
      .in("id", selectedItems);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove items from collection.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Items removed from collection.",
      });
      setSelectedItems([]);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#222222]" style={{ fontFamily: "Playfair Display" }}>
              My Collection
            </h1>
            <p className="text-[#555555] mt-2" style={{ fontFamily: "Montserrat" }}>
              Showcase and organize your most prized collectibles
            </p>
          </div>
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleRemoveItems}
                className="bg-[#1C2833] hover:bg-[#2C3E50]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Selected
              </Button>
            )}
            <Button className="bg-[#C6A961] hover:bg-[#B5983F] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add to Collection
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              className="pl-10" 
              placeholder="Search your collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={collectionType} onValueChange={(value: any) => setCollectionType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="saved">Saved</SelectItem>
                <SelectItem value="purchased">Purchased</SelectItem>
                <SelectItem value="wishlist">Wishlist</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setIsTagDialogOpen(true)}>
              <Tag className="w-4 h-4 mr-2" />
              Manage Tags
            </Button>
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="grid" onClick={() => setView("grid")}>
                <Grid className="w-4 h-4 mr-2" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="list" onClick={() => setView("list")}>
                <List className="w-4 h-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedItems?.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl text-[#222222]">
                      {item.product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <img
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-full h-48 object-cover rounded mb-4 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-white hover:bg-gray-100"
                          onClick={() => handleShare(item.product.id)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-[#555555] mb-4">
                      Added to {item.collection_type} on{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(item.product.id)}
                      >
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {sortedItems?.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4">
                      <img
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#222222]">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-[#555555]">
                          Added on {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(item.product.id)}
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Tags</DialogTitle>
            </DialogHeader>
            {/* Tag management UI will be implemented here */}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
