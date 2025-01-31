import { Package, Star } from "lucide-react";

export function AuthFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
      <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
        <Package className="h-5 w-5 text-primary mt-1" />
        <div>
          <h3 className="font-medium">Personalized Collection</h3>
          <p className="text-sm text-muted-foreground">Track, showcase, and manage your unique treasures</p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
        <Star className="h-5 w-5 text-primary mt-1" />
        <div>
          <h3 className="font-medium">Exclusive Access</h3>
          <p className="text-sm text-muted-foreground">Early notifications for rare finds and special events</p>
        </div>
      </div>
    </div>
  );
}