import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "./FeatureCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CommunitySection() {
  const { data: isAdmin } = useQuery({
    queryKey: ["user-role-admin"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      return roles?.some(r => r.role === 'admin') || false;
    }
  });

  const handleUploadClick = () => {
    console.log("Upload article clicked");
  };

  return (
    <section className="py-20 px-4 bg-nav">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
          Collector's Knowledge Hub
        </h2>
        <p className="text-lg text-white/80 text-center mb-12 max-w-3xl mx-auto">
          Discover expert insights and detailed articles about collecting, authentication, and market trends.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-md mx-auto">
          <FeatureCard
            icon={<File className="w-8 h-8 text-shop-accent1" />}
            title="Expert Articles"
            description="In-depth articles and guides from collecting experts"
          />
        </div>
        {isAdmin && (
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-shop-accent1 hover:bg-shop-600 text-white gap-2"
              onClick={handleUploadClick}
            >
              Upload New Article <File className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}