
import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyRound, UserPlus, ShieldCheck, Settings, Search, Copy, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AuthDocumentation() {
  const { data: examples, isLoading } = useQuery({
    queryKey: ["auth-examples"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authentication_examples")
        .select("*")
        .order("category");
      
      if (error) throw error;
      return data;
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard!");
  };

  return (
    <PageLayout 
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Authentication Documentation" }
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Authentication Documentation</h1>
          <p className="text-muted-foreground">
            Learn about account management and security features on Kollect-It.
          </p>
          <div className="mt-4">
            <Input 
              type="search" 
              placeholder="Search documentation..." 
              className="max-w-md"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
        </header>

        <Tabs defaultValue="getting-started">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="account">Account Management</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started">
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
          </TabsContent>

          <TabsContent value="authentication">
            <div className="grid gap-6">
              {examples?.filter(ex => ex.category === 'authentication').map((example) => (
                <Card key={example.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        {example.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(example.code_snippet)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{example.description}</p>
                    <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                      <code>{example.code_snippet}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-medium">Security Best Practices</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enable two-factor authentication for enhanced security</li>
                  <li>Use strong, unique passwords</li>
                  <li>Monitor your account activity</li>
                  <li>Keep your recovery information up to date</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
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
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
