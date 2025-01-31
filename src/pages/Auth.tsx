import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, User, ShieldCheck, Sparkles, Package, Star } from "lucide-react";
import { Link } from "react-router-dom";

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
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back to Kollect-It!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (error) throw error;
        toast.success("Welcome to Kollect-It! Please check your email to get started.");
      }
    } catch (error: any) {
      toast.error(error.message);
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            {isLogin 
              ? "Welcome Back, Collector!" 
              : "Join the World of Collecting"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isLogin
              ? "Sign in to continue your collecting journey"
              : "Start your collecting adventure today"}
          </p>

          {!isLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Package className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Curate Your Collection</h3>
                  <p className="text-sm text-muted-foreground">Build and showcase your unique treasures</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Star className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">VIP Access</h3>
                  <p className="text-sm text-muted-foreground">Get first dibs on rare finds</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : isLogin 
              ? "Start Exploring Your Collection" 
              : "Begin Your Collecting Journey"}
          </Button>

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <Link
                to="/password-recovery"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300"
                />
                <label htmlFor="remember" className="text-muted-foreground">
                  Remember me
                </label>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? "Ready to start collecting? Join now!"
              : "Already a collector? Sign in"}
          </button>
        </div>

        {!isLogin && (
          <div className="mt-8 space-y-4 border rounded-lg p-4 bg-muted/50">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Why Join Our Community?</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Trusted marketplace for authentic collectibles</li>
                  <li>• Connect with passionate collectors</li>
                  <li>• Track your collection's growth</li>
                  <li>• Exclusive deals and early access</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kollect-It. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}