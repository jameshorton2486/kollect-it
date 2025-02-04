import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import type { ShippingInfo } from "../ShippingForm";

interface ShippingFormFieldsProps {
  formData: ShippingInfo;
  errors: Partial<ShippingInfo>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isGuest?: boolean;
}

export function ShippingFormFields({ formData, errors, handleChange, isGuest = false }: ShippingFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <FormError message={errors.firstName} />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <FormError message={errors.lastName} />
        </div>
      </div>

      {isGuest && (
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormError message={errors.email} />
        </div>
      )}

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <FormError message={errors.address} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <FormError message={errors.city} />
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
          />
          <FormError message={errors.postalCode} />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
        <FormError message={errors.phone} />
      </div>
    </>
  );
}