import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { CollectionFilters } from "@/components/collection/CollectionFilters";
import { CollectionItem } from "@/components/collection/CollectionItem";
import { Card, CardContent } from "@/components/ui/card";
import { Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function PersonalCollection() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionType, setCollectionType] = useState<"all" | "saved" | "purchased" | "wishlist">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price-high" | "price-low">("newest");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: collectionItems, isLoading, refetch } = useQuery({
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
      return data;
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
    const shareUrl = `${window.location.origin}/products/${itemId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "The share link has been copied to your clipboard.",
    });
  };

  const handleRemoveItems = async () => {
    try {
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
        refetch();
      }
    } catch (error) {
      console.error("Error removing items:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CollectionHeader 
          selectedItems={selectedItems}
          onRemoveItems={handleRemoveItems}
        />

        <CollectionFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          collectionType={collectionType}
          onCollectionTypeChange={setCollectionType}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onManageTags={() => setIsTagDialogOpen(true)}
        />

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
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                sortedItems?.map((item) => (
                  <CollectionItem
                    key={item.id}
                    item={item}
                    onShare={handleShare}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {isLoading ? (
                    <p className="p-4">Loading...</p>
                  ) : (
                    sortedItems?.map((item) => (
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
                          <button className="px-3 py-1 text-sm bg-secondary rounded">
                            View
                          </button>
                          <button
                            className="px-3 py-1 text-sm border rounded"
                            onClick={() => handleShare(item.product.id)}
                          >
                            Share
                          </button>
                        </div>
                      </div>
                    ))
                  )}
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
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Tag management functionality coming soon...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
