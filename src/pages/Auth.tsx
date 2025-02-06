
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFeatures } from "@/components/auth/AuthFeatures";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthSwitchMode } from "@/components/auth/AuthSwitchMode";

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "guest">("login");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session check error:", sessionError);
      }
      if (session) {
        console.log("User already authenticated:", session.user.id);
        toast.success("You are already logged in!");
        navigate("/");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (session) {
        console.log("User authenticated successfully:", session.user.id);
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuth = async (values: any) => {
    console.log(`Attempting ${mode} with values:`, values);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email.trim(),
          password: values.password.trim(),
        });
        
        if (error) throw error;

        if (data?.user) {
          console.log("Login successful for user:", data.user.id);
          
          // Fetch user roles
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id);

          console.log("User roles:", roles);
          
          const isAdmin = roles?.some(r => r.role === 'admin');
          
          toast.success(`Welcome back${isAdmin ? ' Administrator' : ''}! You are now logged in.`);
          navigate(isAdmin ? "/admin" : "/");
        }
      } else if (mode === "signup") {
        if (!values.firstName || !values.lastName) {
          throw new Error("Please enter your name");
        }

        const { data, error } = await supabase.auth.signUp({
          email: values.email.trim(),
          password: values.password.trim(),
          options: {
            data: {
              first_name: values.firstName.trim(),
              last_name: values.lastName.trim(),
            },
          },
        });
        
        if (error) throw error;

        if (data?.user) {
          console.log("Account created successfully for user:", data.user.id);
          toast.success("Account created successfully! Welcome to Kollect-It!");
          if (data.user.identities?.[0]?.identity_data?.email_verified) {
            toast.success("You are now logged in!");
          } else {
            toast.info("Please check your email to verify your account.");
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <AuthHeader mode={mode} />
      {mode === "signup" && <AuthFeatures />}
      
      <AuthForm
        mode={mode}
        onSubmit={handleAuth}
      />

      <AuthSwitchMode 
        mode={mode} 
        onChange={setMode}
      />
    </AuthLayout>
  );
}
