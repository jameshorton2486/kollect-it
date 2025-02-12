
import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ShieldCheck, TrendingUp, Truck, Camera, DollarSign, Scale, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function SellerGuidelines() {
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

  return (
    <PageLayout 
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Seller Guidelines" }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Seller Guidelines</h1>
          <p className="text-muted-foreground">
            Everything you need to know about selling antiques and collectibles on Kollect-It.
          </p>
          <Button variant="outline" className="mt-4">
            <FileText className="h-4 w-4 mr-2" />
            Download PDF Guide
          </Button>
        </header>

        <Tabs defaultValue="getting-started">
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
                    <CardTitle>{guideline.title}</CardTitle>
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
