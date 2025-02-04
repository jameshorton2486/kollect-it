import { useState } from "react";
import { StripeCardElement, StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { ShippingInfo } from "../ShippingForm";

export const usePaymentSubmission = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    stripe: any,
    elements: any,
    cardElement: StripeCardElement,
    shippingInfo: ShippingInfo,
    amount: number
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      if (!stripe || !elements) {
        throw new Error("Stripe has not been initialized");
      }

      const { error: cardError } = await stripe.createPaymentMethod({
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

      // Return success
      return {
        success: true,
        paymentMethod: {
          last4: (cardElement as any)._implementation._frame.state.value.last4,
          brand: (cardElement as any)._implementation._frame.state.value.brand,
        },
      };
    } catch (err: any) {
      setError(err.message || "An error occurred during payment processing");
      return { success: false, error: err.message };
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