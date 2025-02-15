import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { CollectionFilters, CollectionType, SortType } from "@/components/collection/CollectionFilters";
import { CollectionItem } from "@/components/collection/CollectionItem";
import { Card, CardContent } from "@/components/ui/card";
import { Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function PersonalCollection() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionType, setCollectionType] = useState<CollectionType>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const { toast } = useToast();

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
        .from('collection_items')
        .delete()
        .in('id', selectedItems);

      if (error) throw error;

      toast({
        title: "Items Removed",
        description: `Successfully removed ${selectedItems.length} item(s) from your collection.`,
      });
      
      setSelectedItems([]);
    } catch (error: any) {
      console.error('Error removing items:', error);
      toast({
        title: "Error",
        description: "Failed to remove items from your collection. Please try again.",
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
              {/* Collection items grid view */}
              {[].map((item) => (
                <CollectionItem
                  key={item.id}
                  item={item}
                  onShare={handleShare}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {/* Collection items list view */}
                  {[].map((item) => (
                    <CollectionItem
                      key={item.id}
                      item={item}
                      onShare={handleShare}
                    />
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
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Tag management functionality will be implemented soon.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
