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
import { toast } from "sonner";

interface PaymentFormProps {
  onSubmit: (shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => void;
  shippingInfo: ShippingInfo | null;
  isLoading?: boolean;
  amount: number;
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

export function PaymentForm({ onSubmit, shippingInfo, isLoading = false, amount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements || !shippingInfo) {
      return;
    }

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          shipping: shippingInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
              email: shippingInfo.email,
              address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
              },
            },
          },
        }
      );

      if (confirmError) {
        throw confirmError;
      }

      if (paymentIntent.status === 'succeeded') {
        const card = paymentIntent.payment_method as any;
        onSubmit(shippingInfo, {
          paymentMethodId: paymentIntent.payment_method as string,
          last4: card.card.last4,
          brand: card.card.brand,
        });
        toast.success('Payment successful!');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      toast.error('Payment failed. Please try again.');
    }
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
          {isLoading ? "Processing..." : `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}`}
        </Button>
      </div>
    </form>
  );
}