import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ShoppingBag } from "lucide-react";

interface ProductsHeaderProps {
  onCreateClick: () => void;
}

export function ProductsHeader({ onCreateClick }: ProductsHeaderProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          Welcome to Kollect-It – Explore & Manage Your Collectibles
        </CardTitle>
        <p className="mt-2 text-muted-foreground">
          Find, browse, and manage your unique collectibles with ease. Whether you're looking to add a rare find
          to your collection or manage your store inventory, Kollect-It provides a seamless shopping and selling experience.
        </p>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button 
          onClick={onCreateClick}
          className="bg-shop-700 hover:bg-shop-800"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          List a Product
        </Button>
        <Button variant="outline">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Browse Collectibles
        </Button>
      </CardContent>
    </Card>
  );
}