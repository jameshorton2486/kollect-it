import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, ShieldCheck, ArrowLeft, AlertCircle, HelpCircle } from "lucide-react";
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
            Return to Sign In
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Secure Account Recovery</h2>
          <p className="text-muted-foreground">
            We'll help you regain access to your collection safely and quickly.
          </p>
        </div>

        {!isSubmitted ? (
          <>
            <div className="mb-8 space-y-4 border rounded-lg p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Account Recovery Steps</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Enter your registered email below</li>
                    <li>Check your inbox for reset instructions</li>
                    <li>Click the secure reset link in the email</li>
                    <li>Create a strong new password</li>
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
                {isLoading ? "Sending Recovery Email..." : "Send Recovery Instructions"}
              </Button>
            </form>

            <div className="mt-8 space-y-4 border rounded-lg p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <h4 className="font-medium">What if I don't receive the reset email?</h4>
                      <p>Check your spam folder first. If you still don't see it, wait 60 seconds and try again. Make sure to use the email address associated with your account.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">How long is the reset link valid?</h4>
                      <p>Reset links expire after 24 hours for security. Request a new one if needed.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Still having trouble?</h4>
                      <p>Contact our support team at support@kollect-it.com for assistance.</p>
                    </div>
                  </div>
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
                Recovery instructions sent to <strong>{email}</strong>. 
                Please check your inbox to reset your password.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                No email? Check your spam folder or request another reset link in 60 seconds.
              </p>
            </div>
            <div className="pt-4">
              <Button asChild>
                <Link to="/auth">Return to Sign In</Link>
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