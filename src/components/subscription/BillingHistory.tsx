
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { UserSubscription } from "@/types/subscription";

interface BillingHistoryProps {
  history: UserSubscription[];
}

export function BillingHistory({ history }: BillingHistoryProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history?.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    {format(new Date(subscription.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{subscription.subscription_plans.name}</TableCell>
                  <TableCell>${subscription.subscription_plans.price}</TableCell>
                  <TableCell>
                    <Badge variant={subscription.status === "active" ? "default" : "destructive"}>
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(subscription.current_period_start), "MMM d")} -{" "}
                    {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
