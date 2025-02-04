import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import type { ShippingInfo } from "./ShippingForm";
import { PaymentFormHeader } from "./payment/PaymentFormHeader";
import { CardElementWrapper } from "./payment/CardElementWrapper";
import { usePaymentSubmission } from "./payment/usePaymentSubmission";
import type { PaymentFormProps } from "./payment/types";

export function PaymentForm({ onSubmit, shippingInfo, isLoading = false, amount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const { error, handleSubmit } = usePaymentSubmission({
    stripe,
    elements,
    shippingInfo,
    amount,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentFormHeader />
      <div className="space-y-4">
        <CardElementWrapper error={error} />
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full"
        >
          {isLoading ? "Processing..." : `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}`}
        </Button>
      </div>
    </form>
  );
}