
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { ShippingInfo } from "./ShippingForm";

interface PaymentFormProps {
  onSubmit: (shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => void;
  shippingInfo: ShippingInfo | null;
  isLoading?: boolean;
}

export interface PaymentInfo {
  paymentMethodId: string;
  last4: string;
  brand: string;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export function PaymentForm({ onSubmit, shippingInfo, isLoading = false }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements || !shippingInfo) {
      return;
    }

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      return;
    }

    onSubmit(shippingInfo, {
      paymentMethodId: paymentMethod.id,
      last4: paymentMethod.card!.last4,
      brand: paymentMethod.card!.brand,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">Payment Information</span>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="card-element">Credit Card</Label>
          <div className="mt-1 border rounded-md p-3">
            <CardElement
              id="card-element"
              options={CARD_ELEMENT_OPTIONS}
            />
          </div>
          {error && <FormError message={error} />}
        </div>

        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full"
        >
          {isLoading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
