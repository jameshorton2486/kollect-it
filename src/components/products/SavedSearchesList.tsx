
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Search, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function SavedSearchesList() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: savedSearches, refetch } = useQuery({
    queryKey: ["saved-searches"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_searches")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Search deleted",
        description: "Your saved search has been removed",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting search:", error);
      toast({
        title: "Error deleting search",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const applySearch = (criteria: any) => {
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (typeof value === "object") {
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, String(value));
      }
    });
    navigate(`/products?${params.toString()}`);
  };

  if (!savedSearches?.length) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>No saved searches yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {savedSearches.map((search) => (
        <Card key={search.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{search.name}</span>
              {search.notify && (
                <div className="flex items-center gap-1">
                  <Bell className="h-4 w-4 text-shop-accent1" />
                  <span className="text-xs text-muted-foreground">
                    {search.notification_frequency}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applySearch(search.criteria)}
              >
                Apply
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(search.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          {search.notify && (
            <div className="mt-2 text-xs text-muted-foreground">
              Notifications: {search.notification_frequency}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
