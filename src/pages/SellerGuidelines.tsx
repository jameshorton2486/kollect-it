import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ShieldCheck, TrendingUp, Truck } from "lucide-react";

export default function SellerGuidelines() {
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
        </header>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Choose Your Subscription Plan</h3>
              <p>Select from our range of seller plans based on your inventory needs:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Basic Seller: List up to 30 items for $20/month</li>
                <li>Professional Seller: List up to 50 items for $30/month</li>
                <li>Enterprise Seller: List up to 100 items for $50/month</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Item Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>For each item listing, you must provide:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clear, high-quality photos from multiple angles</li>
                <li>Detailed item description including condition assessment</li>
                <li>Provenance documentation when available</li>
                <li>Accurate age estimation and historical context</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Respond to buyer inquiries within 24 hours</li>
                <li>Keep your inventory updated and accurate</li>
                <li>Use descriptive titles and relevant categories</li>
                <li>Price items competitively based on market value</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Package items securely with appropriate materials</li>
                <li>Ship within 3 business days of purchase</li>
                <li>Provide tracking information promptly</li>
                <li>Insure valuable items during transit</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}