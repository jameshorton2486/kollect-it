import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function EmailVerification() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (lastSentTime) {
      const timer = setInterval(() => {
        const diff = 60 - Math.floor((Date.now() - lastSentTime.getTime()) / 1000);
        if (diff <= 0) {
          setTimeRemaining(0);
          setLastSentTime(null);
          clearInterval(timer);
        } else {
          setTimeRemaining(diff);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lastSentTime]);

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeRemaining > 0) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
      setLastSentTime(new Date());
      setTimeRemaining(60);
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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kollect-It</h1>
          <Link to="/auth" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto mt-12 px-4">
        <div className="text-center mb-8">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Verify Your Email</h2>
          <p className="text-muted-foreground">
            We've sent you a verification link. Click the link in your email to verify your account.
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            The verification link will expire in 24 hours. If you don't see the email, check your spam folder.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleResendVerification} className="space-y-6">
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
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || timeRemaining > 0}
          >
            {timeRemaining > 0 ? (
              <span className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Wait {timeRemaining}s to resend
              </span>
            ) : isLoading ? (
              "Sending..."
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        </form>

        <div className="mt-12 space-y-6">
          <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium">How long does verification take?</h4>
              <p className="text-sm text-muted-foreground">
                The verification process is instant once you click the link in your email.
                The verification link itself expires after 24 hours.
              </p>
            </div>
            <div>
              <h4 className="font-medium">What if I don't receive the email?</h4>
              <p className="text-sm text-muted-foreground">
                First, check your spam/junk folder. If you still don't see it, you can request
                a new verification email using the form above. Make sure to enter the email
                address you used during registration.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Why do I need to verify my email?</h4>
              <p className="text-sm text-muted-foreground">
                Email verification helps us ensure the security of your account and prevents
                unauthorized access. It also allows us to send you important notifications
                about your account and purchases.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Having technical issues?</h4>
              <p className="text-sm text-muted-foreground">
                If you're experiencing technical difficulties, try clearing your browser cache
                and cookies, or use a different browser. If problems persist, please contact
                our support team.
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