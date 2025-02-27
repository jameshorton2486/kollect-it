
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookmarkPlus } from "lucide-react";

interface SavedSearchDialogProps {
  searchCriteria: {
    search: string;
    category: string;
    condition: string;
    priceRange: { min: string; max: string };
    era: string;
  };
}

export function SavedSearchDialog({ searchCriteria }: SavedSearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [notifyOnNew, setNotifyOnNew] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState("daily");
  const { toast } = useToast();

  const handleSaveSearch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save searches",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from("saved_searches")
        .insert({
          name: searchName,
          criteria: searchCriteria,
          notify: notifyOnNew,
          user_id: user.id,
          notify_criteria: {
            price_threshold: searchCriteria.priceRange.max,
            condition: searchCriteria.condition,
            category: searchCriteria.category
          },
          notification_frequency: notificationFrequency
        });

      if (error) throw error;

      toast({
        title: "Search saved successfully",
        description: notifyOnNew 
          ? `You'll be notified ${notificationFrequency} when new items match your criteria` 
          : "Your search has been saved",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving search:", error);
      toast({
        title: "Error saving search",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookmarkPlus className="h-4 w-4" />
          Save Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Search Criteria</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="search-name">Search Name</Label>
            <Input
              id="search-name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="e.g., Vintage Jewelry under $500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="notify"
              checked={notifyOnNew}
              onCheckedChange={setNotifyOnNew}
            />
            <Label htmlFor="notify">Notify me when new items match</Label>
          </div>
          {notifyOnNew && (
            <div className="space-y-2">
              <Label htmlFor="frequency">Notification Frequency</Label>
              <Select
                value={notificationFrequency}
                onValueChange={setNotificationFrequency}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real-time">Real-time</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <Button onClick={handleSaveSearch} className="w-full">
            Save Search
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
