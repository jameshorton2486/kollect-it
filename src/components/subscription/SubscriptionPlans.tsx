
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  currentPlanId?: string;
  onSubscribe: (planId: string) => void;
}

export function SubscriptionPlans({ plans, currentPlanId, onSubscribe }: SubscriptionPlansProps) {
  return (
    <>
      <h2 className="text-3xl font-bold text-shop-800 mb-8">Available Plans</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {plans?.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {plan.name}
              </CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold text-shop-800">${plan.price}</span>
                <span className="text-shop-600">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-auto bg-[#008080] hover:bg-[#006666] text-white"
                onClick={() => onSubscribe(plan.id)}
                disabled={currentPlanId === plan.id}
              >
                {currentPlanId === plan.id ? "Current Plan" : "Select Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
