
import { ShippingFormFields } from "./shipping/ShippingFormFields";
import { useShippingForm } from "./shipping/useShippingForm";

interface ShippingFormProps {
  onSubmit: (data: ShippingInfo) => void;
  isGuest?: boolean;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export function ShippingForm({ onSubmit, isGuest = false }: ShippingFormProps) {
  const { formData, errors, handleChange, handleSubmit } = useShippingForm(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ShippingFormFields
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        isGuest={isGuest}
      />
    </form>
  );
}
