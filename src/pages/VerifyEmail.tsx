import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          throw new Error("No verification token provided");
        }

        // Get the token from the database
        const { data: tokenData, error: tokenError } = await supabase
          .from("auth_tokens")
          .select("*")
          .eq("token", token)
          .eq("type", "email_verification")
          .single();

        if (tokenError || !tokenData) {
          throw new Error("Invalid or expired verification token");
        }

        if (tokenData.used_at) {
          throw new Error("This verification link has already been used");
        }

        if (new Date(tokenData.expires_at) < new Date()) {
          throw new Error("This verification link has expired");
        }

        // Mark the token as used
        const { error: updateError } = await supabase
          .from("auth_tokens")
          .update({ used_at: new Date().toISOString() })
          .eq("token", token);

        if (updateError) {
          throw new Error("Failed to verify email");
        }

        setIsSuccess(true);
        toast.success("Email verified successfully!");
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (err: any) {
        console.error("Verification error:", err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Kollect-It</h1>
        </div>
      </nav>

      <div className="max-w-md mx-auto mt-12 px-4 text-center">
        {isVerifying ? (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h2 className="text-2xl font-semibold">Verifying your email...</h2>
            <p className="text-muted-foreground">Please wait while we verify your email address.</p>
          </div>
        ) : isSuccess ? (
          <div className="space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-2xl font-semibold text-green-500">Email Verified!</h2>
            <p className="text-muted-foreground">
              Your email has been successfully verified. You will be redirected to the home page shortly.
            </p>
            <Button asChild>
              <Link to="/">Go to Home Page</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-2xl font-semibold text-destructive">Verification Failed</h2>
            <p className="text-muted-foreground">{error}</p>
            <div className="space-y-2">
              <Button asChild>
                <Link to="/auth">Return to Sign In</Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Need help? Contact our support team.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}