
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function MFAVerification() {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleVerification = async () => {
    if (!code) {
      toast.error("Please enter verification code");
      return;
    }

    setIsVerifying(true);
    try {
      // First get the challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: 'totp'
      });

      if (challengeError) throw challengeError;

      // Then verify with the challenge ID
      const { data, error } = await supabase.auth.mfa.verify({
        factorId: 'totp',
        challengeId: challengeData.id,
        code
      });

      if (error) throw error;

      if (data) {
        toast.success("Successfully verified!");
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: rolesData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

          const isAdmin = rolesData?.some(r => r.role === 'admin');
          navigate(isAdmin ? '/admin-dashboard' : '/');
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enter MFA Code
          </CardTitle>
          <CardDescription>
            Please enter the code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mfa-code">Verification Code</Label>
            <Input
              id="mfa-code"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
          </div>
          <Button
            onClick={handleVerification}
            className="w-full"
            disabled={isVerifying || !code}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
