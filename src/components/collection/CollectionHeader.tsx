
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CollectionHeaderProps {
  selectedItems: string[];
  onRemoveItems: () => void;
}

export function CollectionHeader({ selectedItems, onRemoveItems }: CollectionHeaderProps) {
  return (
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
            onClick={onRemoveItems}
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
  );
}
