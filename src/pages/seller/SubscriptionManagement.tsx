import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const subscriptionPlans = [
  {
    name: "Basic",
    price: 20,
    itemLimit: 30,
    features: [
      "Up to 30 items listed",
      "Basic analytics",
      "Standard support",
      "No commission fees"
    ]
  },
  {
    name: "Professional",
    price: 30,
    itemLimit: 50,
    features: [
      "Up to 50 items listed",
      "Advanced analytics",
      "Priority support",
      "No commission fees",
      "Featured listings"
    ]
  },
  {
    name: "Premium",
    price: 50,
    itemLimit: 100,
    features: [
      "Up to 100 items listed",
      "Premium analytics",
      "24/7 Priority support",
      "No commission fees",
      "Featured listings",
      "Custom shop profile"
    ]
  }
];

export default function SubscriptionManagement() {
  return (
    <DashboardLayout pageTitle="Subscription Management">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-shop-800 mb-8">Choose Your Plan</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {plan.name}
                </CardTitle>
                <div className="text-center mt-2">
                  <span className="text-4xl font-bold text-shop-800">${plan.price}</span>
                  <span className="text-shop-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-teal-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-[#008080] hover:bg-[#006666] text-white">
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}