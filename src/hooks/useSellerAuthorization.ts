
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useSellerAuthorization = () => {
  const navigate = useNavigate();

  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return null;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        toast.error("Failed to verify seller access");
        return null;
      }

      return roles?.map(r => r.role) || [];
    }
  });

  useEffect(() => {
    if (!rolesLoading && userRoles && !userRoles.includes('seller')) {
      toast.error("You need seller access to view this page");
      navigate("/");
    }
  }, [userRoles, rolesLoading, navigate]);

  return { userRoles, rolesLoading };
};
