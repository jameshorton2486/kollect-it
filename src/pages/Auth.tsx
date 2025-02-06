
import { useState } from "react";
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

export type AuthMode = "login" | "signup" | "guest";

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useInactivityTimeout();
  useAuthSession();

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
        }
      } else if (mode === "signup") {
        const data = await handleSignup(values);
        if (data?.user) {
          console.log("Account created successfully for user:", data.user.id);
          toast.success("Account created successfully! Welcome to Kollect-It!");
          
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
        // Use the error message we defined or a generic one
        toast.error(error.message || "Authentication failed. Please try again later.");
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

