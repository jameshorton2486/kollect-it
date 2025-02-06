
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

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "guest">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    console.log(`Attempting ${mode} with values:`, values);

    try {
      if (mode === "login") {
        // Validate login data
        loginSchema.parse(values);

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
        // Validate registration data
        registerSchema.parse({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        });

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
              first_name: values.firstName.trim(),
              last_name: values.lastName.trim(),
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
            
            // Trigger verification email using our edge function
            const { error: verificationError } = await supabase.functions.invoke('send-verification-email', {
              body: {
                email: values.email.trim(),
                userId: data.user.id,
              },
            });

            if (verificationError) {
              console.error("Error sending verification email:", verificationError);
              toast.error("There was an issue sending the verification email. Please contact support.");
            }
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
