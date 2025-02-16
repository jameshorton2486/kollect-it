
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isDevelopment, signInWithTestAccount } from "@/lib/auth/devAuth";

export function useAuthSession() {
  const navigate = useNavigate();

  useEffect(() => {
    // Temporarily disabled auth check for development
    console.log("Auth check temporarily disabled for development");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
}
