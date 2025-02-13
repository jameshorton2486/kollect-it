
import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BookOpen, ShieldCheck, TrendingUp, Truck, Camera, 
  DollarSign, Scale, FileText, Download, ExternalLink,
  Mail, Phone, CircleHelp, MessageSquare
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConditionGuidelines } from "@/components/products/ConditionGuidelines";
import { useToast } from "@/hooks/use-toast";

export default function SellerGuidelines() {
  const { toast } = useToast();
  
  const handleStartSelling = () => {
    toast({
      title: "Starting Your Selling Journey",
      description: "Redirecting you to create your first listing.",
    });
  };

  const handleContactSupport = () => {
    toast({
      title: "Support Request",
      description: "Redirecting you to our seller support team.",
    });
  };

  return (
    <PageLayout 
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Seller Guidelines" }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4">Seller Guidelines</h1>
              <p className="text-muted-foreground text-lg mb-6">
                Welcome to Kollect-It's Seller Community! These guidelines ensure a smooth and positive experience 
                for both buyers and sellers. By listing your items on Kollect-It, you agree to abide by these guidelines.
              </p>
              <Button size="lg" onClick={handleStartSelling} className="mr-4">
                Start Listing Now
              </Button>
              <Button variant="outline" size="lg" onClick={handleContactSupport}>
                Contact Support
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <Camera className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Quality Listings</h3>
              <p className="text-sm text-muted-foreground">High-quality photos and detailed descriptions</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <Truck className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-sm text-muted-foreground">Ship within 3 business days</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <MessageSquare className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Communication</h3>
              <p className="text-sm text-muted-foreground">Prompt and professional responses</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <ShieldCheck className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Seller Protection</h3>
              <p className="text-sm text-muted-foreground">Secure payments and support</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listing" className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="listing">Listing Items</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            <TabsTrigger value="payments">Fees & Payments</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="listing">
            <Card>
              <CardHeader>
                <CardTitle>Creating Quality Listings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and detailed descriptions</li>
                  <li>Use high-quality photographs from multiple angles</li>
                  <li>Set competitive and fair prices</li>
                  <li>Choose appropriate categories</li>
                  <li>Disclose any flaws or imperfections</li>
                </ul>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Prohibited Items</h3>
                  <p className="text-muted-foreground">
                    Review our <Link to="/community-guidelines" className="text-primary hover:underline">Community Guidelines</Link> for 
                    a complete list of prohibited items, including counterfeit goods and items that violate intellectual property rights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Returns Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Shipping Requirements</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Ship items within 3 business days of purchase</li>
                    <li>Provide tracking information for all shipments</li>
                    <li>State shipping costs and methods clearly</li>
                    <li>Package items securely to prevent damage</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Returns Process</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>14-day return window from delivery date</li>
                    <li>Clear return policy in listings</li>
                    <li>Prompt response to return requests</li>
                    <li>Efficient refund processing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Fees & Payment Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Kollect-It charges a commission fee on successful sales. View our complete fee structure on 
                  the <Link to="/seller-fees" className="text-primary hover:underline">Seller Fees</Link> page.
                </p>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Payment Processing</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Secure payment processing through our platform</li>
                    <li>Regular scheduled payouts</li>
                    <li>Transaction history in Seller Dashboard</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <Mail className="h-6 w-6 mb-4 text-primary" />
                      <h3 className="font-semibold mb-2">Email Support</h3>
                      <p className="text-sm text-muted-foreground">
                        support@kollect-it.com
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <Phone className="h-6 w-6 mb-4 text-primary" />
                      <h3 className="font-semibold mb-2">Phone Support</h3>
                      <p className="text-sm text-muted-foreground">
                        1-800-KOLLECT
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Seller Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/seller-dashboard" className="block">
                      <Card className="hover:bg-primary/5 transition-colors">
                        <CardContent className="pt-6">
                          <TrendingUp className="h-6 w-6 mb-4 text-primary" />
                          <h4 className="font-semibold">Seller Dashboard</h4>
                          <p className="text-sm text-muted-foreground">
                            Manage listings and track sales
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link to="/community-guidelines" className="block">
                      <Card className="hover:bg-primary/5 transition-colors">
                        <CardContent className="pt-6">
                          <CircleHelp className="h-6 w-6 mb-4 text-primary" />
                          <h4 className="font-semibold">Community Guidelines</h4>
                          <p className="text-sm text-muted-foreground">
                            Learn about our policies
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
