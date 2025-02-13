
import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, ShieldCheck, TrendingUp, Truck, Camera, 
  DollarSign, Scale, FileText, Download, ExternalLink 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConditionGuidelines } from "@/components/products/ConditionGuidelines";
import { useToast } from "@/hooks/use-toast";

export default function SellerGuidelines() {
  const { toast } = useToast();
  
  const { data: guidelines, isLoading } = useQuery({
    queryKey: ["seller-guidelines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seller_guidelines")
        .select("*")
        .order("order_position");
      
      if (error) throw error;
      return data;
    },
  });

  const filterGuidelinesByCategory = (category: string) => {
    return guidelines?.filter(guide => guide.category === category) || [];
  };

  const handleDownloadGuide = () => {
    // In a real app, this would trigger a PDF download
    toast({
      title: "Download Started",
      description: "Your comprehensive seller guide is being downloaded.",
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
                Everything you need to know about selling antiques and collectibles on Kollect-It.
                Follow these guidelines to ensure a successful selling experience.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleDownloadGuide}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF Guide
              </Button>
              <Button variant="default" onClick={handleContactSupport}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <BookOpen className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Getting Started</h3>
                <p className="text-sm text-muted-foreground">Learn the basics of selling on our platform</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <Camera className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Quality Standards</h3>
                <p className="text-sm text-muted-foreground">Photo and description requirements</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Best Practices</h3>
                <p className="text-sm text-muted-foreground">Tips for successful selling</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <ShieldCheck className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Seller Protection</h3>
                <p className="text-sm text-muted-foreground">How we protect our sellers</p>
              </CardContent>
            </Card>
          </div>
        </header>

        <Tabs defaultValue="getting-started" className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="listing">Listing Items</TabsTrigger>
            <TabsTrigger value="selling">Selling</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started">
            <div className="grid gap-6">
              {filterGuidelinesByCategory('getting-started').map((guideline) => (
                <Card key={guideline.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {guideline.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: guideline.content }} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="listing">
            <div className="grid gap-6">
              {filterGuidelinesByCategory('listing').map((guideline) => (
                <Card key={guideline.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      {guideline.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: guideline.content }} />
                  </CardContent>
                </Card>
              ))}
              <ConditionGuidelines />
            </div>
          </TabsContent>

          <TabsContent value="selling">
            <div className="grid gap-6">
              {filterGuidelinesByCategory('selling').map((guideline) => (
                <Card key={guideline.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      {guideline.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: guideline.content }} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid gap-6">
              {filterGuidelinesByCategory('compliance').map((guideline) => (
                <Card key={guideline.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      {guideline.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: guideline.content }} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
