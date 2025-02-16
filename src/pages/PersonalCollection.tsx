
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { CollectionFilters, CollectionType, SortType } from "@/components/collection/CollectionFilters";
import { CollectionItem } from "@/components/collection/CollectionItem";
import { Card, CardContent } from "@/components/ui/card";
import { Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CollectionItemType {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  acquisition_date: string;
  estimated_value: number;
  images: string[];
  notes: string;
  created_at: string;
  collection_type: string;
  user_id: string;
  updated_at: string;
}

export default function PersonalCollection() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionType, setCollectionType] = useState<CollectionType>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [items, setItems] = useState<CollectionItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionItems = async () => {
      try {
        const { data, error } = await supabase
          .from('personal_collection_items')
          .select('*')
          .order(sortBy === 'newest' ? 'created_at' : 'name');

        if (error) throw error;

        // Transform the data to match CollectionItemType
        const transformedData = data.map(item => ({
          ...item,
          images: item.images || [],
          category: item.category || '',
          collection_type: item.collection_type || 'general'
        })) as CollectionItemType[];

        setItems(transformedData);
      } catch (error: any) {
        console.error('Error fetching collection items:', error);
        toast.error("Failed to load your collection items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionItems();
  }, [sortBy]);

  const handleShare = (itemId: string) => {
    const shareUrl = `${window.location.origin}/collection/${itemId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      description: "The share link has been copied to your clipboard."
    });
  };

  const handleRemoveItems = async () => {
    try {
      const { error } = await supabase
        .from('personal_collection_items')
        .delete()
        .in('id', selectedItems);

      if (error) throw error;

      setItems(items.filter(item => !selectedItems.includes(item.id)));
      toast.success(`Successfully removed ${selectedItems.length} item(s) from your collection.`);
      setSelectedItems([]);
    } catch (error: any) {
      console.error('Error removing items:', error);
      toast.error("Failed to remove items from your collection. Please try again.");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = collectionType === "all" || item.category === collectionType;
    return matchesSearch && matchesType;
  });

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
              {filteredItems.map((item) => (
                <CollectionItem
                  key={item.id}
                  item={{
                    id: item.id,
                    product: {
                      id: item.id,
                      name: item.name,
                      image_url: item.images?.[0] || '/placeholder.svg'
                    },
                    collection_type: item.category,
                    created_at: item.created_at
                  }}
                  onShare={handleShare}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredItems.map((item) => (
                    <CollectionItem
                      key={item.id}
                      item={{
                        id: item.id,
                        product: {
                          id: item.id,
                          name: item.name,
                          image_url: item.images?.[0] || '/placeholder.svg'
                        },
                        collection_type: item.category,
                        created_at: item.created_at
                      }}
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
