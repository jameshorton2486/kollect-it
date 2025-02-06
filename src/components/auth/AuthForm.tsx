
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, LogIn } from "lucide-react";
import { Form } from "@/components/ui/form";
import { AuthFormFields } from "./AuthFormFields";
import { loginSchema, registerSchema } from "@/lib/validations/schemas";

export interface AuthFormValues {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface AuthFormProps {
  mode: "login" | "signup" | "guest";
  onSubmit: (values: AuthFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function AuthForm({ mode = "login", onSubmit, isSubmitting = false }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: AuthFormValues) => {
    await onSubmit(values);
  };

  const isGuest = mode === "guest";
  const isLogin = mode === "login";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <AuthFormFields
          isLogin={isLogin}
          isGuest={isGuest}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          form={form}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <span className="animate-spin mr-2">⌛</span>
              {mode === "login" ? "Signing in..." : 
               mode === "guest" ? "Continuing as guest..." : 
               "Creating account..."}
            </div>
          ) : (
            <div className="flex items-center">
              {mode === "login" ? (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              ) : mode === "guest" ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Continue as Guest
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
}
