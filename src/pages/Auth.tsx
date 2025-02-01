import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFeatures } from "@/components/auth/AuthFeatures";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFAQ } from "@/components/auth/AuthFAQ";

export function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Trim whitespace from credentials
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      // Basic validation
      if (!trimmedEmail || !trimmedPassword) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (isLogin) {
        console.log("Attempting login with:", { email: trimmedEmail }); // Log email for debugging
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        
        if (error) {
          console.error("Login error:", error); // Log full error for debugging
          throw error;
        }

        if (data?.user) {
          console.log("Login successful:", data.user.id); // Log success for debugging
          toast.success("Welcome back!");
          navigate("/");
        }
      } else {
        if (!name.trim()) {
          toast.error("Please enter your name");
          return;
        }

        console.log("Attempting signup with:", { email: trimmedEmail }); // Log email for debugging
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });
        
        if (error) {
          console.error("Signup error:", error); // Log full error for debugging
          throw error;
        }

        if (data?.user) {
          console.log("Signup successful:", data.user.id); // Log success for debugging
          toast.success("Welcome to Kollect-It! Please check your email to verify your account.");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Kollect-It</h1>
        </div>
      </nav>

      <div className="max-w-md mx-auto mt-12 px-4">
        <AuthHeader isLogin={isLogin} />
        {!isLogin && <AuthFeatures />}
        
        <AuthForm
          isLogin={isLogin}
          isLoading={isLoading}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          name={name}
          setName={setName}
          handleAuth={handleAuth}
        />

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? "New to collecting? Start your journey!"
              : "Already a collector? Sign in"}
          </button>
        </div>

        <AuthFAQ />
      </div>

      <footer className="border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kollect-It. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}