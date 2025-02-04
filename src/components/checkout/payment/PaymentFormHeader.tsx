import { CreditCard } from "lucide-react";

export function PaymentFormHeader() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <CreditCard className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium">Payment Information</span>
    </div>
  );
}