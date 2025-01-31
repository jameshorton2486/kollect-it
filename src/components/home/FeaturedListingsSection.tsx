import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function FeaturedListingsSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-4">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-center text-shop-900">
            Featured Listings
          </h2>
        </div>
        <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
          Discover trending and newly added collectibles from our curated selection
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Placeholder cards - will be replaced with real data */}
          {[1, 2, 3].map((item) => (
            <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-shop-100" />
              <div className="p-4">
                <Badge variant="secondary" className="mb-2">New Arrival</Badge>
                <h3 className="text-xl font-semibold mb-2">Featured Item {item}</h3>
                <p className="text-shop-600">A beautiful collectible piece with historical significance.</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}