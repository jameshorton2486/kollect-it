
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CollectionItemProps {
  item: {
    id: string;
    product: {
      id: string;
      name: string;
      image_url: string;
    };
    collection_type: string;
    created_at: string;
  };
  onShare: (id: string) => void;
}

export function CollectionItem({ item, onShare }: CollectionItemProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
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
              onClick={() => onShare(item.product.id)}
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
            onClick={() => onShare(item.product.id)}
          >
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
