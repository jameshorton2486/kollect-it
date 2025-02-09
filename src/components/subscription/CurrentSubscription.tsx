
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { UserSubscription } from "@/types/subscription";

interface CurrentSubscriptionProps {
  subscription: UserSubscription;
}

export function CurrentSubscription({ subscription }: CurrentSubscriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{subscription.subscription_plans.name} Plan</h3>
            <p className="text-muted-foreground">
              Renews on {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}
            </p>
          </div>
          <Badge variant={subscription.status === "active" ? "default" : "destructive"}>
            {subscription.status.toUpperCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
