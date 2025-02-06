
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuthSession() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session check error:", sessionError);
        toast.error("Error checking session status");
      }
      if (session) {
        console.log("User already authenticated:", session.user.id);
        toast.success("Welcome back! You are already logged in.");
        navigate("/");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        navigate("/auth");
        return;
      }
      
      if (session) {
        // Check if email is verified
        if (!session.user.email_confirmed_at) {
          console.log("Email not verified yet");
          navigate("/email-verification");
          return;
        }

        console.log("User authenticated successfully:", session.user.id);
        
        // Fetch user roles
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (rolesError) {
          console.error("Error fetching user roles:", rolesError);
        }

        const isAdmin = roles?.some(r => r.role === 'admin');
        toast.success(`Welcome${isAdmin ? ' Administrator' : ''}! You've successfully logged in.`);
        navigate(isAdmin ? "/admin" : "/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
}
