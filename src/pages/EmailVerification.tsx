import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Clock, HelpCircle, ShieldCheck } from "lucide-react";
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
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">One Step Away from Your Collection Journey!</h2>
          <p className="text-muted-foreground">
            Verify your email to unlock exclusive features and start discovering unique collectibles.
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Almost There!</AlertTitle>
          <AlertDescription>
            We've sent a verification link to your email. Click it to activate your account and begin your collecting adventure!
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Email Verification Steps
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Open the verification email from Kollect-It</li>
              <li>Click the "Verify Email Address" button</li>
              <li>Return to Kollect-It and sign in</li>
              <li>Start exploring and collecting!</li>
            </ol>
          </div>

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
                  Resend available in {timeRemaining}s
                </span>
              ) : isLoading ? (
                "Sending..."
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          </form>

        <div className="mt-12 space-y-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Common Questions
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium">Missing Verification Email?</h4>
              <p className="text-sm text-muted-foreground">
                Check your spam folder first. Still can't find it? Use the resend button above.
                Add noreply@kollect-it.com to your safe senders list to ensure you receive our emails.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Why Verify Your Email?</h4>
              <p className="text-sm text-muted-foreground">
                Email verification unlocks these exclusive features:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Create and manage your collection listings</li>
                <li>• Communicate with sellers and buyers</li>
                <li>• Access to watchlists and price alerts</li>
                <li>• Participate in exclusive collector events</li>
                <li>• Receive personalized recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Need Help?</h4>
              <p className="text-sm text-muted-foreground">
                Our support team is ready to assist! Contact us at support@kollect-it.com
                or visit our help center for immediate assistance.
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
