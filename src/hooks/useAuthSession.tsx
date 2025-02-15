
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isDevelopment, signInWithTestAccount } from "@/lib/auth/devAuth";

export function useAuthSession() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session check error:", sessionError);
        toast.error("Error checking session status");
      }

      // If no session and in development, attempt to sign in with test account
      if (!session && isDevelopment) {
        console.log("Development environment detected, attempting to sign in with test account...");
        const testSignIn = await signInWithTestAccount();
        if (testSignIn?.session) {
          console.log("Successfully signed in with test account");
          return;
        }
      }

      if (session) {
        // Fetch user roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (rolesError) {
          console.error("Error fetching user roles:", rolesError);
          return;
        }

        const roles = rolesData || [];
        const isAdmin = roles.some(r => r.role === 'admin');
        console.log("User already authenticated:", session.user.id, isAdmin ? '(admin)' : '');
        toast.success("Welcome back! You are already logged in.");
        navigate(isAdmin ? "/admin-dashboard" : "/");
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
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (rolesError) {
          console.error("Error fetching user roles:", rolesError);
          return;
        }

        const roles = rolesData || [];
        const isAdmin = roles.some(r => r.role === 'admin');
        toast.success(`Welcome${isAdmin ? ' Administrator' : ''}! You've successfully logged in.`);
        navigate(isAdmin ? "/admin-dashboard" : "/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
}
