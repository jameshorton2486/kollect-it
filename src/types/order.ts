export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderDetails {
  id: string;
  status: string;
  shipping_address: ShippingAddress;
  tracking_number?: string | null;
  tracking_carrier?: string | null;
  estimated_delivery_date?: string | null;
  total_amount: number;
  created_at: string;
  order_items: Array<{
    id: string;
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}