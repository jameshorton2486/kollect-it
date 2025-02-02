import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "./FeatureCard";

export function CommunitySection() {
  return (
    <section className="py-20 px-4 bg-shop-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-shop-900 mb-4">
          Join a Community of Collectors
        </h2>
        <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
          Connect, trade, and discuss your prized finds with fellow collectors who share your passion.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-md mx-auto">
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Showcase Collection"
            description="Display and share your most treasured items"
          />
        </div>
        <div className="text-center mt-12">
          <Button size="lg" className="gap-2">
            Join the Community <Users className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}