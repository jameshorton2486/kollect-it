import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function PasswordRecovery() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastSubmitTime < 60000) {
      toast.error("Please wait 60 seconds before requesting another reset email");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      if (error) throw error;
      setIsSubmitted(true);
      setLastSubmitTime(now);
      toast.success("Password reset instructions sent to your email!");
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
        <Button
          variant="ghost"
          className="mb-6"
          asChild
        >
          <Link to="/auth">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Reset Your Password</h2>
          <p className="text-muted-foreground">
            Don't worry! It happens to the best of us. Follow these simple steps to reset your password and regain access to your account.
          </p>
        </div>

        {!isSubmitted ? (
          <>
            <div className="mb-8 space-y-4 border rounded-lg p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Password Reset Steps</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Enter your email address below</li>
                    <li>Check your inbox for reset instructions</li>
                    <li>Click the reset link in the email</li>
                    <li>Create a new secure password</li>
                  </ol>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
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
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>

            <div className="mt-8 space-y-4 border rounded-lg p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Creating a Strong Password</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Use at least 8 characters</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Add numbers and special characters</li>
                    <li>• Avoid using personal information</li>
                    <li>• Use a unique password not used elsewhere</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6 bg-muted/50 p-6 rounded-lg border">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Check Your Email</h3>
              <p className="text-muted-foreground text-sm">
                We've sent password reset instructions to <strong>{email}</strong>. 
                Please check your inbox and spam folder.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Didn't receive the email? Check your spam folder or request another reset email in 60 seconds.
              </p>
            </div>
            <div className="pt-4">
              <Button asChild>
                <Link to="/auth">Return to Login</Link>
              </Button>
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