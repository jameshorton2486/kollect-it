
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFeatures } from "@/components/auth/AuthFeatures";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthSwitchMode } from "@/components/auth/AuthSwitchMode";
import { loginSchema, registerSchema } from "@/lib/validations/schemas";

export type AuthMode = "login" | "signup" | "guest";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Setup inactivity timeout
  useEffect(() => {
    let inactivityTimer: number;

    const resetInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(async () => {
        console.log("User inactive for too long, signing out...");
        await supabase.auth.signOut();
        toast.info("You've been logged out due to inactivity");
        navigate("/auth");
      }, INACTIVITY_TIMEOUT);
    };

    // Reset timer on user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    // Initial setup
    resetInactivityTimer();

    // Cleanup
    return () => {
      window.clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [navigate]);

  // Check session and handle auth state changes
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

  const handleAuth = async (values: Record<string, string>) => {
    setIsSubmitting(true);
    console.log(`Processing ${mode} request with values:`, values);

    try {
      if (mode === "login") {
        // Validate login data
        loginSchema.parse(values);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email.trim(),
          password: values.password.trim(),
        });
        
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            toast.error("Please verify your email before logging in.");
            navigate("/email-verification");
            return;
          }
          throw error;
        }

        if (data?.user) {
          console.log("Login successful for user:", data.user.id);
          
          if (!data.user.email_confirmed_at) {
            toast.info("Please verify your email to complete the login process.");
            navigate("/email-verification");
            return;
          }

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
        // Validate registration data
        registerSchema.parse(values);

        // Check if email already exists
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', values.email.trim())
          .single();

        if (existingUser) {
          throw new Error("This email is already registered. Please use a different email or try logging in.");
        }

        const { data, error } = await supabase.auth.signUp({
          email: values.email.trim(),
          password: values.password.trim(),
          options: {
            data: {
              first_name: values.firstName?.trim(),
              last_name: values.lastName?.trim(),
            },
          },
        });
        
        if (error) throw error;

        if (data?.user) {
          console.log("Account created successfully for user:", data.user.id);
          toast.success("Account created successfully! Welcome to Kollect-It!");
          
          // Check if email verification is required
          if (data.user.identities?.[0]?.identity_data?.email_verified) {
            toast.success("You are now logged in!");
          } else {
            toast.info("Please check your email to verify your account.");
            navigate("/email-verification");
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle Zod validation errors
      if (error.errors) {
        error.errors.forEach((err: any) => {
          toast.error(err.message);
        });
      } else {
        toast.error(error.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
