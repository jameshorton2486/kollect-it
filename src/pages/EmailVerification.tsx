import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function EmailVerification() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
      toast.success("Verification email resent successfully!");
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
          <h2 className="text-3xl font-bold mb-4">Verify Your Email</h2>
          <p className="text-muted-foreground">
            Please check your email for a verification link. If you haven't
            received it, you can request a new one below.
          </p>
        </div>

        <form onSubmit={handleResendVerification} className="space-y-6">
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Resend Verification Email"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/auth" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">How long does verification take?</h4>
              <p className="text-sm text-muted-foreground">
                The verification email should arrive within a few minutes. Be sure
                to check your spam folder.
              </p>
            </div>
            <div>
              <h4 className="font-medium">What if I don't receive the email?</h4>
              <p className="text-sm text-muted-foreground">
                You can request a new verification email using the form above. Make
                sure to enter the email address you used during registration.
              </p>
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