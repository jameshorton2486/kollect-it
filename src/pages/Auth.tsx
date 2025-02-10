
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFeatures } from "@/components/auth/AuthFeatures";
import { AuthForm, AuthFormValues } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthSwitchMode } from "@/components/auth/AuthSwitchMode";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { handleLogin, handleSignup } from "@/lib/auth/authHandlers";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export type AuthMode = "login" | "signup" | "guest";

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useInactivityTimeout();
  useAuthSession();
  useSession();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: rolesData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        const isAdmin = rolesData?.some(r => r.role === 'admin');
        navigate(isAdmin ? '/admin-dashboard' : '/');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleAuth = async (values: AuthFormValues) => {
    setIsSubmitting(true);
    console.log(`Processing ${mode} request with values:`, values);

    try {
      if (mode === "login") {
        const data = await handleLogin(values);
        if (data?.user) {
          console.log("Login successful for user:", data.user.id);
          
          if (!data.user.email_confirmed_at) {
            toast.info("Please verify your email to complete the login process.");
            navigate("/email-verification");
            return;
          }

          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id);

          if (rolesError) {
            console.error("Error fetching user roles:", rolesError);
            toast.error('Error fetching user roles');
            return;
          }

          const isAdmin = rolesData?.some(r => r.role === 'admin');
          if (isAdmin) {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        }
      } else if (mode === "signup") {
        const data = await handleSignup(values);
        if (data?.user) {
          console.log("Account created successfully for user:", data.user.id);
          toast.success("Account created successfully! Welcome to Kollect-It!");
          
          if (data.user.identities?.[0]?.identity_data?.email_verified) {
            toast.success("You are now logged in!");
            const { data: rolesData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', data.user.id);

            const isAdmin = rolesData?.some(r => r.role === 'admin');
            navigate(isAdmin ? '/admin-dashboard' : '/');
          } else {
            toast.info("Please check your email to verify your account.");
            navigate("/email-verification");
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          toast.error(err.message);
        });
      } else {
        toast.error(error.message || "Authentication failed. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeader mode={mode} />
      {mode === "signup" && <AuthFeatures />}
      
      <AuthForm
        mode={mode}
        onSubmit={handleAuth}
        isSubmitting={isSubmitting}
      />

      <AuthSwitchMode 
        mode={mode} 
        onChange={setMode}
      />
    </AuthLayout>
  );
}
