import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, LogIn } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthFormFields } from "./AuthFormFields";

const authSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode?: "login" | "signup" | "guest";
  onSubmit: (values: AuthFormValues) => Promise<void>;
}

export function AuthForm({ mode = "login", onSubmit }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        >
          {isLoading ? (
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