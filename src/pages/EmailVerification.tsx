import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Clock, HelpCircle } from "lucide-react";
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
          <h2 className="text-3xl font-bold mb-4">One Step Away from Your Collection</h2>
          <p className="text-muted-foreground">
            Verify your email to unlock exclusive features and start your collecting journey!
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Almost There!</AlertTitle>
          <AlertDescription>
            Check your email for the verification link to activate your account and start exploring.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Verification Steps
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
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium">How long does verification take?</h4>
                <p className="text-sm text-muted-foreground">
                  The verification process is instant once you click the link in your email.
                  The verification link itself expires after 24 hours.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Why verify my email?</h4>
                <p className="text-sm text-muted-foreground">
                  Email verification helps us ensure the security of your account and gives you access to:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Full access to buying and selling features</li>
                  <li>• Personalized collection management</li>
                  <li>• Important notifications about your items</li>
                  <li>• Secure communication with other collectors</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Need Additional Help?</h4>
                <p className="text-sm text-muted-foreground">
                  If you're experiencing technical difficulties or need assistance,
                  please contact our support team at support@kollect-it.com
                </p>
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
