
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shield, Smartphone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function MFASetup() {
  const [isEnabling, setIsEnabling] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const enableMFA = async () => {
    try {
      setIsEnabling(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to enable MFA");
        return;
      }

      const { data: factorData, error: factorError } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (factorError) throw factorError;

      if (factorData) {
        setQrCodeUrl(factorData.totp.qr_code);
        setSecret(factorData.totp.secret);
        setFactorId(factorData.id);

        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: factorData.id
        });

        if (challengeError) throw challengeError;
        setChallengeId(challengeData.id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to enable MFA");
    } finally {
      setIsEnabling(false);
    }
  };

  const verifyMFA = async () => {
    if (!verificationCode || !factorId || !challengeId) {
      toast.error("Please enter verification code");
      return;
    }

    try {
      setIsVerifying(true);
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verificationCode
      });

      if (error) throw error;

      if (data) {
        toast.success("MFA enabled successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify MFA");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" aria-hidden="true" />
          <span>Multi-Factor Authentication</span>
        </CardTitle>
        <CardDescription>
          Enhance your account security by enabling two-factor authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!qrCodeUrl ? (
          <Button 
            onClick={enableMFA} 
            disabled={isEnabling}
            className="w-full"
            aria-label={isEnabling ? "Setting up MFA..." : "Enable MFA"}
          >
            {isEnabling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Setting up MFA...</span>
              </>
            ) : (
              <>
                <Smartphone className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Enable MFA</span>
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <img 
                src={qrCodeUrl} 
                alt="QR Code for MFA setup" 
                className="w-48 h-48"
                aria-label="Scan this QR code with your authenticator app"
              />
              {secret && (
                <code className="p-2 bg-muted rounded text-sm break-all select-all" role="textbox" aria-label="Secret key for manual entry">
                  {secret}
                </code>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                aria-label="Enter the 6-digit verification code from your authenticator app"
                required
              />
            </div>
            <Button 
              onClick={verifyMFA} 
              className="w-full"
              disabled={isVerifying || !verificationCode}
              aria-label={isVerifying ? "Verifying..." : "Verify and Enable MFA"}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify and Enable MFA</span>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
