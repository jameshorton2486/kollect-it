import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, User, ShieldCheck, Package, Star, HelpCircle, KeyRound } from "lucide-react";
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
        toast.success("Welcome back to your collection journey!");
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
        toast.success("Welcome to Kollect-It! Please check your email to begin your collecting journey.");
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
          <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            {isLogin 
              ? "Welcome Back to Your Collection!" 
              : "Begin Your Collecting Journey"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isLogin
              ? "Secure access to your collection, watchlist, and exclusive features awaits."
              : "Join our thriving community of collectors and unlock a world of unique treasures."}
          </p>

          {!isLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Package className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Personalized Collection</h3>
                  <p className="text-sm text-muted-foreground">Track, showcase, and manage your unique treasures</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Star className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Exclusive Access</h3>
                  <p className="text-sm text-muted-foreground">Early notifications for rare finds and special events</p>
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
            <p className="text-xs text-muted-foreground">
              {isLogin ? "" : "Use 8+ characters with a mix of letters, numbers & symbols"}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : isLogin 
              ? "Start Exploring Your Collection" 
              : "Begin Your Collecting Journey"}
          </Button>

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <Link
                to="/password-recovery"
                className="text-primary hover:underline inline-flex items-center"
              >
                <KeyRound className="mr-1 h-3 w-3" />
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
              ? "New to collecting? Start your journey!"
              : "Already a collector? Sign in"}
          </button>
        </div>

        <div className="mt-8 space-y-4 border rounded-lg p-4 bg-muted/50">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium">How do I get started?</h4>
                  <p>Create an account, verify your email, and start exploring our vast collection of unique items.</p>
                </div>
                <div>
                  <h4 className="font-medium">Is my information secure?</h4>
                  <p>Absolutely! We use industry-standard encryption and security measures to protect your data.</p>
                </div>
                <div>
                  <h4 className="font-medium">What features do I get access to?</h4>
                  <p>Members enjoy exclusive features like watchlists, price alerts, and early access to special collections!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kollect-It. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}