import { useState, useEffect } from "react";
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

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session check error:", sessionError);
      }
      if (session) {
        console.log("User already authenticated:", session.user.id);
        navigate("/");
      }
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(`Attempting ${isLogin ? 'login' : 'signup'} with email:`, email);

    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        throw new Error("Please fill in all required fields");
      }

      if (isLogin) {
        // Add detailed logging for login attempt
        console.log("Starting login process...");
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        
        if (error) {
          console.error("Login error details:", {
            message: error.message,
            status: error.status,
            name: error.name,
            stack: error.stack
          });
          throw error;
        }

        if (data?.user) {
          console.log("Login successful for user:", {
            id: data.user.id,
            email: data.user.email,
            lastSignIn: data.user.last_sign_in_at
          });
          toast.success("Welcome back!");
          navigate("/");
        }
      } else {
        if (!name.trim()) {
          throw new Error("Please enter your name");
        }

        console.log("Starting signup process...");
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
          console.error("Signup error details:", {
            message: error.message,
            status: error.status,
            name: error.name,
            stack: error.stack
          });
          throw error;
        }

        if (data?.user) {
          console.log("Signup successful for user:", {
            id: data.user.id,
            email: data.user.email,
            confirmationSent: data.user.confirmation_sent_at
          });

          // Send verification email
          const response = await supabase.functions.invoke('send-verification-email', {
            body: {
              email: trimmedEmail,
              userId: data.user.id,
            },
          });

          if (response.error) {
            console.error("Error sending verification email:", response.error);
            throw new Error("Failed to send verification email");
          }

          toast.success("Welcome to Kollect-It! Please check your email to verify your account.");
        }
      }
    } catch (error: any) {
      console.error("Auth error details:", {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack
      });
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