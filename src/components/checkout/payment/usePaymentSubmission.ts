import { useState } from "react";
import { toast } from "sonner";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import type { ShippingInfo } from "../ShippingForm";
import type { PaymentInfo } from "./types";

interface UsePaymentSubmissionProps {
  stripe: Stripe | null;
  elements: StripeElements | null;
  shippingInfo: ShippingInfo | null;
  amount: number;
  onSubmit: (shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => void;
}

export function usePaymentSubmission({
  stripe,
  elements,
  shippingInfo,
  amount,
  onSubmit,
}: UsePaymentSubmissionProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements || !shippingInfo) {
      return;
    }

    try {
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

  return { error, handleSubmit };
}