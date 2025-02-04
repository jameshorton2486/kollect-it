import { CardElement } from "@stripe/react-stripe-js";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";

interface CardElementWrapperProps {
  error: string | null;
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

export function CardElementWrapper({ error }: CardElementWrapperProps) {
  return (
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
  );
}