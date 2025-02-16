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
import { OAuthProviders } from "@/components/auth/OAuthProviders";
import { useQuery } from "@tanstack/react-query";
import { isDevelopment, signInWithTestAccount } from "@/lib/auth/devAuth";

export type AuthMode = "login" | "signup" | "guest";

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const maxAttempts = 5;
  const lockoutDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  
  useInactivityTimeout();
  useAuthSession();
  useSession();

  useEffect(() => {
    if (isDevelopment) {
      signInWithTestAccount().then((data) => {
        if (data?.user) {
          console.log("Development mode: Auto-signed in with test account");
          navigate('/');
        }
      });
    }
  }, [navigate]);

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
  });

  const { data: userRoles, isLoading: isRolesLoading } = useQuery({
    queryKey: ["userRoles", session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session!.user.id);

      if (rolesError) throw rolesError;
      return rolesData || [];
    }
  });

  useEffect(() => {
    if (session && userRoles) {
      const isAdmin = userRoles.some(r => r.role === 'admin');
      console.log("User authenticated with roles:", userRoles);
      if (!session.user.email_confirmed_at) {
        navigate("/email-verification");
        return;
      }
      navigate(isAdmin ? '/admin-dashboard' : '/');
    }
  }, [session, userRoles, navigate]);

  useEffect(() => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
      toast.error(`Too many failed attempts. Please try again in ${remainingTime} minutes.`);
    }
  }, [lockoutUntil]);

  const handleAuth = async (values: AuthFormValues) => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
      toast.error(`Account is temporarily locked. Please try again in ${remainingTime} minutes.`);
      return;
    }

    setIsSubmitting(true);
    console.log(`Processing ${mode} request with values:`, values);

    try {
      if (mode === "login") {
        const data = await handleLogin(values);
        if (data?.user) {
          console.log("Login successful for user:", data.user.id);
          setLoginAttempts(0); // Reset attempts on successful login
          
          // Check for MFA enrollment
          const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
          
          if (mfaData?.currentLevel === 'aal1' && mfaData?.nextLevel === 'aal2') {
            navigate("/mfa-verification");
            return;
          }
          
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
      
      if (mode === "login") {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= maxAttempts) {
          const lockoutTime = Date.now() + lockoutDuration;
          setLockoutUntil(lockoutTime);
          toast.error(`Account temporarily locked. Please try again in 15 minutes.`);
          return;
        }
        
        const remainingAttempts = maxAttempts - newAttempts;
        toast.error(`Login failed. ${remainingAttempts} attempts remaining.`);
      }
      
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

  if (isSessionLoading || isRolesLoading) {
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
      {isDevelopment ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Auto-signing in with test account...</span>
        </div>
      ) : (
        <>
          <AuthHeader mode={mode} />
          {mode === "signup" && <AuthFeatures />}
          
          <AuthForm
            mode={mode}
            onSubmit={handleAuth}
            isSubmitting={isSubmitting}
          />

          <OAuthProviders />

          <AuthSwitchMode 
            mode={mode} 
            onChange={setMode}
          />
        </>
      )}
    </AuthLayout>
  );
}
