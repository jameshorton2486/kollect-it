import { useState } from "react";
import type { ShippingInfo } from "../ShippingForm";

export function useShippingForm(onSubmit: (data: ShippingInfo) => void) {
  const [formData, setFormData] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  const validateForm = () => {
    const newErrors: Partial<ShippingInfo> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingInfo]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
  };
}