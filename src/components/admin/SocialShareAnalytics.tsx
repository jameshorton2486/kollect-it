import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader } from "@/components/ui/loader";

export function SocialShareAnalytics() {
  const { data: shareData, isLoading } = useQuery({
    queryKey: ["social-shares-analytics"],
    queryFn: async () => {
      const { data: shares, error } = await supabase
        .from("social_shares")
        .select(`
          platform,
          product_id,
          products (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process data for visualization
      const platformCounts = shares?.reduce((acc: any, share) => {
        acc[share.platform] = (acc[share.platform] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(platformCounts || {}).map(([platform, count]) => ({
        platform,
        shares: count,
      }));
    },
  });

  if (isLoading) return <Loader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Share Analytics</CardTitle>
        <CardDescription>
          Track how your products are being shared across different platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={shareData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="shares" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}