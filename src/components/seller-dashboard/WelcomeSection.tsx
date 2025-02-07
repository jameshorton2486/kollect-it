
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function WelcomeSection() {
  const { data: profile } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      return profile;
    }
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-shop-800 mb-4">
        Welcome back, {profile?.first_name || "Seller"}!
      </h1>
      <p className="text-shop-600 max-w-3xl">
        Manage your antique collection, track sales, and grow your business with Kollect-It's 
        comprehensive seller tools. Our platform helps you reach collectors worldwide while 
        providing the tools you need to succeed.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="bg-shop-50 p-4 rounded-lg">
          <h3 className="font-semibold text-shop-800">Wide Reach</h3>
          <p className="text-sm text-shop-600">Connect with collectors globally</p>
        </div>
        <div className="bg-shop-50 p-4 rounded-lg">
          <h3 className="font-semibold text-shop-800">Easy Management</h3>
          <p className="text-sm text-shop-600">Powerful tools for your inventory</p>
        </div>
        <div className="bg-shop-50 p-4 rounded-lg">
          <h3 className="font-semibold text-shop-800">Secure Payments</h3>
          <p className="text-sm text-shop-600">Safe and reliable transactions</p>
        </div>
      </div>
    </div>
  );
}
