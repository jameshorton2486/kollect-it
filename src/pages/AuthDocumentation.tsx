import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, UserPlus, ShieldCheck, Settings } from "lucide-react";

export default function AuthDocumentation() {
  return (
    <PageLayout 
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Authentication Documentation" }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Authentication Documentation</h1>
          <p className="text-muted-foreground">
            Learn about account management and security features on Kollect-It.
          </p>
        </header>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Account Creation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Creating Your Account</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Click "Sign Up" in the navigation bar</li>
                <li>Enter your email address and create a password</li>
                <li>Verify your email address</li>
                <li>Complete your profile information</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Password Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Password requirements:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Minimum 8 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one number</li>
                <li>At least one special character</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Security Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Two-factor authentication available</li>
                <li>Automatic session timeout</li>
                <li>Login attempt monitoring</li>
                <li>Secure password reset process</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Managing Your Account</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Update profile information in account settings</li>
                <li>Change email preferences</li>
                <li>Manage notification settings</li>
                <li>View account activity history</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}