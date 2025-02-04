import type { ShippingInfo } from "../ShippingForm";

export interface PaymentInfo {
  paymentMethodId: string;
  last4: string;
  brand: string;
}

export interface PaymentFormProps {
  onSubmit: (shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => void;
  shippingInfo: ShippingInfo | null;
  isLoading?: boolean;
  amount: number;
}