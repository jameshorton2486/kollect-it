
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export const useSellerNotifications = (isSellerAuthorized: boolean) => {
  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ["seller-notifications"],
    enabled: isSellerAuthorized,
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data } = await supabase
        .from("order_notifications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      return data || [];
    }
  });

  useEffect(() => {
    if (!isSellerAuthorized) return;

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_notifications',
        },
        () => {
          refetchNotifications();
          toast.info("New notification received");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchNotifications, isSellerAuthorized]);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("order_notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) {
      toast.error("Failed to mark notification as read");
    } else {
      refetchNotifications();
    }
  };

  return { notifications, markAsRead };
};
