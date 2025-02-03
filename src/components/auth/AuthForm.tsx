import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AuthFormFields } from "./AuthFormFields";
import { AuthLoginExtras } from "./AuthLoginExtras";

interface AuthFormProps {
  isLogin: boolean;
  isLoading: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  handleAuth: (e: React.FormEvent) => Promise<void>;
}

export function AuthForm({
  isLogin,
  isLoading,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  handleAuth,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await handleAuth(e);
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthFormFields
        isLogin={isLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        name={name}
        setName={setName}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Please wait..." : isLogin 
          ? "Sign In" 
          : "Create Account"}
      </Button>

      {isLogin && <AuthLoginExtras />}
    </form>
  );
}