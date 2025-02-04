import { useState, FormEvent } from "react";
import { Stripe, StripeElements } from "@stripe/stripe-js";
import type { ShippingInfo } from "../ShippingForm";
import type { PaymentInfo } from "./types";

interface UsePaymentSubmissionProps {
  stripe: Stripe | null;
  elements: StripeElements | null;
  shippingInfo: ShippingInfo | null;
  amount: number;
  onSubmit: (shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => void;
}

export const usePaymentSubmission = ({ stripe, elements, shippingInfo, amount, onSubmit }: UsePaymentSubmissionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!stripe || !elements || !shippingInfo) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement('card');
    if (!cardElement) {
      setError("Card element not found");
      setIsProcessing(false);
      return;
    }

    try {
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: {
            line1: shippingInfo.address,
            city: shippingInfo.city,
            postal_code: shippingInfo.postalCode,
            country: "US",
          },
        },
      });

      if (cardError) {
        throw cardError;
      }

      if (paymentMethod) {
        onSubmit(shippingInfo, {
          paymentMethodId: paymentMethod.id,
          last4: paymentMethod.card?.last4 || '',
          brand: paymentMethod.card?.brand || '',
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during payment processing");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleSubmit,
    isProcessing,
    error,
  };
};